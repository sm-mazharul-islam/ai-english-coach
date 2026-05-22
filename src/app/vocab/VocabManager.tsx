"use client";

import { useState, useTransition } from "react";
import { addVocabulary, toggleLearned, deleteVocabulary } from "@/actions/vocabActions";
import { BookOpen, Search, Plus, Trash2, CheckCircle2, Circle, Sparkles, Volume2, HelpCircle } from "lucide-react";

export default function VocabManager({ initialVocab }: { initialVocab: any[] }) {
  const [vocabList, setVocabList] = useState(initialVocab);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "LEARNED" | "UNLEARNED">("ALL");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [word, setWord] = useState("");
  const [bangla, setBangla] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [example, setExample] = useState("");

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Optimistic update
    const tempId = Math.random().toString();
    const newWordObj = {
      id: tempId,
      word: word.trim(),
      banglaMeaning: bangla.trim(),
      pronunciation: pronunciation.trim() || null,
      exampleSentence: example.trim() || null,
      learned: false,
    };

    setVocabList([newWordObj, ...vocabList]);
    setWord("");
    setBangla("");
    setPronunciation("");
    setExample("");

    const res = await addVocabulary(formData);
    if (res && res.error) {
      setError(res.error);
      // Revert optimistic update
      setVocabList(vocabList);
    } else {
      // Refresh with real data
      window.location.reload();
    }
  };

  const handleToggle = (id: string, current: boolean) => {
    // Optimistic toggle
    setVocabList(
      vocabList.map((v) => (v.id === id ? { ...v, learned: !current } : v))
    );

    startTransition(async () => {
      const res = await toggleLearned(id, current);
      if (res && res.error) {
        setError(res.error);
        // Revert
        setVocabList(vocabList);
      }
    });
  };

  const handleDelete = (id: string) => {
    // Optimistic delete
    setVocabList(vocabList.filter((v) => v.id !== id));

    startTransition(async () => {
      const res = await deleteVocabulary(id);
      if (res && res.error) {
        setError(res.error);
        // Revert
        setVocabList(vocabList);
      }
    });
  };

  // Filter & Search logic
  const filteredVocab = vocabList.filter((v) => {
    const matchesSearch =
      v.word.toLowerCase().includes(search.toLowerCase()) ||
      v.banglaMeaning.toLowerCase().includes(search.toLowerCase()) ||
      (v.exampleSentence && v.exampleSentence.toLowerCase().includes(search.toLowerCase()));

    if (filter === "LEARNED") return matchesSearch && v.learned;
    if (filter === "UNLEARNED") return matchesSearch && !v.learned;
    return matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Add Word Form */}
      <div className="lg:col-span-1">
        <div className="glass-panel rounded-3xl p-6 sticky top-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400">
              <Plus size={16} />
            </span>
            <h3 className="text-lg font-bold text-white">Add New Vocabulary</h3>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">English Word *</label>
              <input
                name="word"
                type="text"
                required
                placeholder="e.g. Ephemeral"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="w-full rounded-xl glass-input px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Bangla Meaning *</label>
              <input
                name="banglaMeaning"
                type="text"
                required
                placeholder="e.g. ক্ষণস্থায়ী"
                value={bangla}
                onChange={(e) => setBangla(e.target.value)}
                className="w-full rounded-xl glass-input px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Pronunciation Guide (Optional)</label>
              <input
                name="pronunciation"
                type="text"
                placeholder="e.g. ih-fem-er-uhl"
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
                className="w-full rounded-xl glass-input px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Example Sentence (Optional)</label>
              <textarea
                name="exampleSentence"
                placeholder="e.g. Life is ephemeral, so cherish every single moment."
                value={example}
                onChange={(e) => setExample(e.target.value)}
                rows={3}
                className="w-full rounded-xl glass-input px-4 py-2.5 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-3 text-sm font-bold text-white transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:scale-[1.01] cursor-pointer"
            >
              <Plus size={16} />
              Save Word (+10 XP)
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Search, Filter, Word Cards */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Search & Filters */}
        <div className="glass-panel rounded-3xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/30">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search words, meanings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl glass-input pl-10 pr-4 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {(["ALL", "UNLEARNED", "LEARNED"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`flex-1 md:flex-initial rounded-xl px-4 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                  filter === mode
                    ? "bg-violet-500/10 text-violet-300 border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                    : "text-white/50 hover:text-white border-transparent hover:bg-white/5"
                }`}
              >
                {mode === "ALL" ? "All Words" : mode === "UNLEARNED" ? "To Learn" : "Learned"}
              </button>
            ))}
          </div>
        </div>

        {/* Word Cards Grid */}
        {filteredVocab.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center">
            <BookOpen size={48} className="text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Words Found</h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              Add your first word or modify your filters to start building your personal bilingual vocabulary bank!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVocab.map((vocab) => (
              <div
                key={vocab.id}
                className={`glass-panel rounded-2xl p-5 border transition-all relative group flex flex-col justify-between min-h-[180px] ${
                  vocab.learned
                    ? "border-teal-500/10 bg-teal-500/[0.01]"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="text-xl font-extrabold text-white tracking-tight">{vocab.word}</h4>
                      {vocab.pronunciation && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-white/40 italic">
                          <Volume2 size={10} />
                          /{vocab.pronunciation}/
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggle(vocab.id, vocab.learned)}
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        vocab.learned
                          ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
                          : "border-white/10 hover:border-white/20 text-white/30 hover:text-white"
                      }`}
                      title={vocab.learned ? "Mark as unlearned" : "Mark as learned"}
                    >
                      {vocab.learned ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>
                  </div>

                  <span className="inline-block rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300 px-2.5 py-1 mb-3">
                    {vocab.banglaMeaning}
                  </span>

                  {vocab.exampleSentence && (
                    <p className="text-xs text-white/50 italic leading-relaxed border-l-2 border-white/5 pl-3 mt-1.5">
                      "{vocab.exampleSentence}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                  <span className="text-[10px] text-white/30">
                    {vocab.learned ? (
                      <span className="text-teal-400 flex items-center gap-1 font-semibold">
                        <Sparkles size={8} /> Saved (+10 XP) • Learned (+5 XP)
                      </span>
                    ) : (
                      "Saved (+10 XP)"
                    )}
                  </span>

                  <button
                    onClick={() => handleDelete(vocab.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all p-1 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    title="Delete Word"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

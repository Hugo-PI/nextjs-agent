'use client';
import { useRef, useState } from 'react';
import {
  SquarePen,
  Search,
  Loader2,
  Check,
  X,
  Pencil,
  RefreshCcw,
  Settings,
  Trash2,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useThreads } from '@/hooks/useThreads';
import { Thread } from '@/types/message';

interface ThreadListProps {
  onOpenMCPConfig: () => void;
};
export default function ThreadList({ onOpenMCPConfig }: ThreadListProps) {
  const { threads, createThread, deleteThread, refetchThreads } = useThreads();
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [savingRename, setSavingRename] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 新建线索
  const handleCreateThread = async () => {
    setIsCreating(true);
    try {
      const newThread = await createThread();
      router.push(`/thread/${newThread.id}`);
    } finally {
      setIsCreating(false);
    }
  };

  // 所有线索列表数据
  const filtered = threads.filter((t) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (t.title || "").toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
  });

  const startRename = (id: string, current: string | undefined) => {
    setRenamingId(id);
    setRenameValue(current || "");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const saveRename = async () => {
    if (!renamingId) return;
    setSavingRename(true);
    try {
      await fetch("/api/agent/threads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: renamingId, title: renameValue || "Untitled thread" }),
      });
      await refetchThreads();
      setRenamingId(null);
    } catch (e) {
      console.error("Rename failed", e);
    } finally {
      setSavingRename(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchThreads();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm("确认删除吗？")) {
      return;
    }
    setDeletingId(threadId);
    try {
      await deleteThread(threadId);
      // Navigation will be handled by the useThreads hook if we're deleting the active thread
    } catch (e) {
      console.error("删除失败", e);
      alert("删除失败. 请重试.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <nav className="flex h-full flex-col border-r border-gray-200 bg-white/60 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60">
      <div className="space-y-2 px-3 pt-3 pb-2">
        <div className="flex gap-2">
          <button
            className="bg-primary text-primary-foreground inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:brightness-110 disabled:opacity-50"
            disabled={isCreating}
            onClick={handleCreateThread}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SquarePen className="h-4 w-4" />
            )}
            新建
          </button>
          <button
            className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md border px-2 py-2"
            onClick={handleRefresh}
            title="刷新"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="group relative">
          <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="查询线索..."
            className="w-full rounded-md border border-gray-300/70 bg-white/40 py-1.5 pr-2 pl-8 text-xs focus:ring-2 focus:ring-blue-500/40 focus:outline-none dark:border-gray-700/70 dark:bg-gray-800/40"
          />
        </div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {
          filtered.map((thread: Thread) => {
            const active = pathname === `/thread/${thread.id}`;
            const isRenaming = renamingId === thread.id;
            return (
              <div
                key={thread.id}
                className={`group relative cursor-pointer rounded-md border border-transparent px-3 py-2 text-left ${active ? "bg-accent text-accent-foreground dark:bg-accent/60" : "hover:bg-muted/60 dark:hover:bg-muted/30 text-foreground/80"}`}
                onClick={() => {
                  if (!isRenaming) router.push(`/thread/${thread.id}`);
                }}
              >
                {!isRenaming && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium" title={thread.title || thread.id}>
                      {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(thread.id, thread.title);
                        }}
                        className="hover:bg-muted inline-flex h-5 w-5 items-center justify-center rounded"
                        title="Rename"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteThread(thread.id);
                        }}
                        disabled={deletingId === thread.id}
                        className="hover:bg-muted inline-flex h-5 w-5 items-center justify-center rounded hover:text-red-600 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === thread.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {isRenaming && (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      ref={inputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename();
                        if (e.key === "Escape") cancelRename();
                      }}
                      className="bg-background border-input focus:ring-ring/40 flex-1 rounded border px-2 py-1 text-xs focus:ring-2 focus:outline-none"
                    />
                    <button
                      disabled={savingRename}
                      onClick={saveRename}
                      className="bg-primary text-primary-foreground inline-flex h-6 w-6 items-center justify-center rounded hover:brightness-110 disabled:opacity-50"
                    >
                      {savingRename ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={cancelRename}
                      className="bg-muted text-muted-foreground inline-flex h-6 w-6 items-center justify-center rounded hover:brightness-110"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="text-muted-foreground/70 mt-1 flex items-center gap-2 text-[10px]">
                  <span>{thread.id.slice(0, 6)}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        }
        {filtered.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-gray-400">没有线索可显示</div>
        )}
      </div>
      {/* MCP Configuration Button */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={onOpenMCPConfig}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
          MCP服务器配置
        </button>
      </div>
    </nav>
  );
}

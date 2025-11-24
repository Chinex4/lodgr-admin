import React from "react";
import {
  CalendarDays,
  MoreHorizontal,
  MessageCircleMore,
  Share2,
  BarChart3,
  Smile,
} from "lucide-react";

const topPost = {
  name: "Full Name",
  username: "@username",
  time: "2 mins",
  caption: "Lorem ipsum dolor sit amet consectetur. Turpis ut nunc feugiat.",
  stats: {
    reactions: "25k",
    shares: 250,
    comments: 250,
    views: 250,
  },
};

function TopPerformingContentCard() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            Top Performing Content
          </h3>
          <p className="text-xs text-neutral-500">
            See the best performing content.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
            <CalendarDays className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-neutral-900 text-white px-3 py-1.5 text-xs hover:bg-neutral-800">
            24hrs
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 flex-1 ">
        <div className="h-full rounded-2xl border border-neutral-100 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)] overflow-hidden">
          {/* Creator header */}
          <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                F
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-neutral-900">
                    {topPost.name}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {topPost.username}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                  <span className="mr-1">🌐</span>
                  <span>{topPost.time}</span>
                </div>
              </div>
            </div>
            <MoreHorizontal className="h-4 w-4 text-neutral-400" />
          </div>

          {/* Caption */}
          <div className="px-4 pb-2">
            <p className="text-sm text-neutral-800">{topPost.caption}</p>
          </div>

          {/* Dummy image/meme */}
          <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-100">
            <div className="h-[200px] w-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-500">
              <img className="w-full h-full" src="/images/post-thumbnail.png" alt="" />
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 pb-3 flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Smile className="h-4 w-4 text-amber-500" />
              <span>{topPost.stats.reactions}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              <span>{topPost.stats.shares}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircleMore className="h-3.5 w-3.5" />
              <span>{topPost.stats.comments}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>{topPost.stats.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopPerformingContentCard;

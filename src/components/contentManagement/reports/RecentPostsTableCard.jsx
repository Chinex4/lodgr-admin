import React from "react";
import { MessageCircle, Laugh, Share2, BarChart3 } from "lucide-react";

const recentPosts = [
  {
    id: "1",
    thumbnail: "/images/sample-post-1.png",
    title: "Lorem ipsum dolor sit amet",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    createdAt: "Jun 24 - 12:45 PM",
    comments: 259,
    reactions: "40k",
    shares: "12k",
    impressions: 246,
  },
  {
    id: "2",
    thumbnail: "/images/sample-post-1.png",
    title: "Lorem ipsum dolor sit amet",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    createdAt: "Jun 24 - 12:45 PM",
    comments: 259,
    reactions: "40k",
    shares: "12k",
    impressions: 246,
  },
  {
    id: "3",
    thumbnail: "/images/sample-post-1.png",
    title: "Lorem ipsum dolor sit amet",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    createdAt: "Jun 24 - 12:45 PM",
    comments: 259,
    reactions: "40k",
    shares: "12k",
    impressions: 246,
  },
  {
    id: "4",
    thumbnail: "/images/sample-post-1.png",
    title: "Lorem ipsum dolor sit amet",
    creatorName: "Stanley Adams",
    creatorAvatar: "/images/avatars/stanley.png",
    createdAt: "Jun 24 - 12:45 PM",
    comments: 259,
    reactions: "40k",
    shares: "12k",
    impressions: 246,
  },
];

function RecentPostsTableCard() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm px-4 md:px-6 pt-5 pb-5">
      <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-4">
        Recent Posts
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-xs text-neutral-500 border-b border-neutral-100">
              <th className="px-2 md:px-3 py-3 font-medium">Thumbnail</th>
              <th className="px-2 md:px-3 py-3 font-medium">Post</th>
              <th className="px-2 md:px-3 py-3 font-medium">Creator</th>
              <th className="px-2 md:px-3 py-3 font-medium whitespace-nowrap">
                Date Created
              </th>
              <th className="px-2 md:px-3 py-3 font-medium">Comment</th>
              <th className="px-2 md:px-3 py-3 font-medium">Reaction</th>
              <th className="px-2 md:px-3 py-3 font-medium">Share</th>
              <th className="px-2 md:px-3 py-3 font-medium">Impression</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map((post, idx) => (
              <tr
                key={post.id}
                className={`border-b border-neutral-100 last:border-b-0 ${
                  idx % 2 === 1 ? "bg-neutral-50/40" : "bg-white"
                }`}
              >
                {/* thumbnail */}
                <td className="px-2 md:px-3 py-3 align-middle">
                  <div className="h-12 w-16 rounded-md overflow-hidden bg-neutral-200">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>

                {/* post title */}
                <td className="px-2 md:px-3 py-3 align-middle text-neutral-800">
                  <span className="truncate max-w-[220px] inline-block">
                    {post.title}
                  </span>
                </td>

                {/* creator */}
                <td className="px-2 md:px-3 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-neutral-200 overflow-hidden">
                      <img
                        src={post.creatorAvatar}
                        alt={post.creatorName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-neutral-800">{post.creatorName}</span>
                  </div>
                </td>

                {/* date */}
                <td className="px-2 md:px-3 py-3 align-middle text-neutral-700 whitespace-nowrap">
                  {post.createdAt}
                </td>

                {/* comment */}
                <td className="px-2 md:px-3 py-3 align-middle text-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <span>{post.comments}</span>
                    <MessageCircle className="h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </td>

                {/* reaction */}
                <td className="px-2 md:px-3 py-3 align-middle text-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <span>{post.reactions}</span>
                    😂
                  </div>
                </td>

                {/* share */}
                <td className="px-2 md:px-3 py-3 align-middle text-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <span>{post.shares}</span>
                    <Share2 className="h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </td>

                {/* impression */}
                <td className="px-2 md:px-3 py-3 align-middle text-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <span>{post.impressions}</span>
                    <BarChart3 className="h-3.5 w-3.5 text-neutral-500" />
                  </div>
                </td>
              </tr>
            ))}

            {recentPosts.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-neutral-500"
                >
                  No recent posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentPostsTableCard;

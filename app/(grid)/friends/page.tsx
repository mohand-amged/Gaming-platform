"use client";
import React, { useState, useEffect } from "react";
import { getFriends, searchUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend } from "@/app/actions/friends";
import Heading from "@/app/components/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Image from "next/image";
import { Search, UserPlus, Check, X, UserMinus } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    secure_url: string;
  };
  bio?: string;
}

const FriendsPage = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const result = await getFriends();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setFriends(result.friends || []);
      setFriendRequests(result.friendRequests || []);
      setSentRequests(result.sentFriendRequests || []);
    } catch {
      toast.error("Failed to load friends");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchUsers(searchQuery);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setSearchResults(result.users || []);
    } catch {
      toast.error("Failed to search users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      const result = await sendFriendRequest(userId);
      if (result.success) {
        toast.success(result.success);
        loadFriends();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to send friend request");
    }
  };

  const handleAcceptRequest = async (userId: string) => {
    try {
      const result = await acceptFriendRequest(userId);
      if (result.success) {
        toast.success(result.success);
        loadFriends();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to accept friend request");
    }
  };

  const handleRejectRequest = async (userId: string) => {
    try {
      const result = await rejectFriendRequest(userId);
      if (result.success) {
        toast.success(result.success);
        loadFriends();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to reject friend request");
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    try {
      const result = await removeFriend(userId);
      if (result.success) {
        toast.success(result.success);
        loadFriends();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to remove friend");
    }
  };

  const UserCard = ({ user, action, actionLabel, actionIcon, onAction }: {
    user: User;
    action?: string;
    actionLabel?: string;
    actionIcon?: React.ReactNode;
    onAction?: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 bg-main rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600">
          {user.avatar?.secure_url ? (
            <Image
              src={user.avatar.secure_url}
              alt={user.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-white">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.email}</p>
          {user.bio && <p className="text-xs text-gray-500 mt-1">{user.bio}</p>}
        </div>
      </div>
      {action && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );

  return (
    <div className="mt-10 flex flex-col gap-6">
      <Heading text="Friends" />
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('friends')}
          className={`pb-2 px-4 ${activeTab === 'friends' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-2 px-4 ${activeTab === 'requests' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}
        >
          Requests ({friendRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`pb-2 px-4 ${activeTab === 'search' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}
        >
          Find Friends
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'friends' && (
          <div className="space-y-3">
            {friends.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No friends yet. Start by searching for friends!</p>
            ) : (
              friends.map((friend) => (
                <UserCard
                  key={friend._id}
                  user={friend}
                  action="remove"
                  actionLabel="Remove"
                  actionIcon={<UserMinus className="w-4 h-4" />}
                  onAction={() => handleRemoveFriend(friend._id)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-3">
            {friendRequests.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No pending friend requests</p>
            ) : (
              friendRequests.map((request) => (
                <UserCard
                  key={request._id}
                  user={request}
                  action="accept"
                  actionLabel="Accept"
                  actionIcon={<Check className="w-4 h-4" />}
                  onAction={() => handleAcceptRequest(request._id)}
                />
              ))
            )}
            
            {sentRequests.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-3">Sent Requests</h3>
                <div className="space-y-3">
                  {sentRequests.map((request) => (
                    <UserCard
                      key={request._id}
                      user={request}
                      action="cancel"
                      actionLabel="Cancel"
                      actionIcon={<X className="w-4 h-4" />}
                      onAction={() => handleRejectRequest(request._id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {searchResults.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  action="add"
                  actionLabel="Add Friend"
                  actionIcon={<UserPlus className="w-4 h-4" />}
                  onAction={() => handleSendRequest(user._id)}
                />
              ))}
              
              {searchQuery && searchResults.length === 0 && !isSearching && (
                <p className="text-gray-400 text-center py-8">No users found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;

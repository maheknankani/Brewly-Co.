import React from 'react';
import { useStore } from '../context/StoreContext';
import { Award, X, Gift, Check, Sparkles, Star } from 'lucide-react';

export const RewardsModal = () => {
  const { isRewardsOpen, setIsRewardsOpen, user, showToast } = useStore();

  if (!isRewardsOpen) return null;

  const rewards = [
    { points: 100, reward: "$5.00 Off Next Coffee Bag", code: "REWARD5" },
    { points: 200, reward: "Free 250g Sample Bag of Ethiopia Guji", code: "FREESAMPLE" },
    { points: 350, reward: "Free Artisan Glass Pour-Over Dripper", code: "FREEGEAR" }
  ];

  const handleRedeem = (r) => {
    if (user.loyaltyPoints >= r.points) {
      showToast(`Redeemed! Use code ${r.code} at checkout.`);
    } else {
      showToast(`You need ${r.points - user.loyaltyPoints} more points to redeem this reward.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={() => setIsRewardsOpen(false)}
        className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="relative bg-cream-100 rounded-3xl max-w-lg w-full border border-cream-300 shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-300 pb-4">
          <div className="flex items-center gap-2">
            <Award size={24} className="text-amberGold-500" />
            <h2 className="font-serif text-2xl font-bold text-espresso-900">Brewly Ritual Rewards</h2>
          </div>
          <button
            onClick={() => setIsRewardsOpen(false)}
            className="p-2 text-espresso-900/70 hover:text-espresso-900 rounded-full hover:bg-cream-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Balance Card */}
        <div className="bg-forest-700 text-cream-100 p-6 rounded-2xl border border-forest-600 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider text-amberGold-400 font-bold block">Current Balance</span>
              <div className="text-4xl font-serif font-bold text-cream-100 mt-1">{user.loyaltyPoints} Points</div>
            </div>
            <div className="bg-amberGold-500 text-espresso-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {user.tier} Tier
            </div>
          </div>
          <p className="text-xs text-cream-200/80 pt-1">
            Earn 1 point for every $1 spent on all coffee, equipment & subscriptions.
          </p>
        </div>

        {/* Redeemable Perks */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-espresso-900">Available Rewards</h3>

          {rewards.map((r, i) => (
            <div
              key={i}
              className="bg-cream-200/60 border border-cream-300 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cream-100 border border-cream-300 flex items-center justify-center text-amberGold-500">
                  <Gift size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-espresso-900">{r.reward}</div>
                  <div className="text-[10px] text-forest-700 font-semibold">{r.points} Loyalty Points</div>
                </div>
              </div>

              <button
                onClick={() => handleRedeem(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  user.loyaltyPoints >= r.points
                    ? 'bg-amberGold-500 hover:bg-amberGold-600 text-espresso-900 shadow'
                    : 'bg-cream-300 text-espresso-900/50 cursor-not-allowed'
                }`}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

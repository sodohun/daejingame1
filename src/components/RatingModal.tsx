import React, { useState } from 'react';

export interface RatingData {
  stars: number;
  trigger: 'level_up' | 'game_over';
  level: number;
  score: number;
  tags: string[];
  comment?: string;
  createdAt: string;
}

interface RatingModalProps {
  isOpen: boolean;
  trigger: 'level_up' | 'game_over';
  currentLevel: number;
  currentScore: number;
  onClose: () => void;
  onSubmit: (data: RatingData) => void;
}

const FEEDBACK_TAGS = [
  '💎 보석 손맛이 짜릿해요',
  '❄️ 얼음 보석 신선해요',
  '🟨 사각 폭발 쾌감!',
  '🎵 사운드/BGM 중독성',
  '📱 2000년대 PDA 감성',
  '⚡ 하이퍼큐브 꿀잼',
  '⏱️ 스릴 넘치는 템포',
];

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  trigger,
  currentLevel,
  currentScore,
  onClose,
  onSubmit,
}) => {
  const [stars, setStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeStarCount = hoverStars !== null ? hoverStars : stars;

  const getStarLabel = (count: number) => {
    switch (count) {
      case 5:
        return '최고예요! 완벽한 중독성 💎';
      case 4:
        return '아주 재미있어요! 👍';
      case 3:
        return '무난하고 괜찮아요 🙂';
      case 2:
        return '조금 더 개선되면 좋겠어요 😅';
      case 1:
        return '아쉬운 점이 많아요 🛠️';
      default:
        return '별점을 선택해주세요';
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    const data: RatingData = {
      stars,
      trigger,
      level: currentLevel,
      score: currentScore,
      tags: selectedTags,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('bejeweled_ratings');
      const list = existing ? JSON.parse(existing) : [];
      list.push(data);
      localStorage.setItem('bejeweled_ratings', JSON.stringify(list));
    } catch {
      // LocalStorage fallback
    }

    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(data);
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex items-center justify-center z-50 p-3 select-none">
      <div className="bg-[#ece9d8] border-2 border-[#0055ea] rounded-xs shadow-2xl p-4 max-w-[310px] w-full text-center font-sans text-neutral-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-[#a0a0a0] pb-1.5 mb-2">
          <div className="flex items-center space-x-1.5">
            <span className="text-base">{trigger === 'level_up' ? '🏆' : '🎮'}</span>
            <span className="text-xs font-black text-[#00227b] uppercase tracking-wider">
              {trigger === 'level_up' ? '레벨 승급 평가' : '플레이 만족도 조사'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-black font-bold text-xs p-1 cursor-pointer"
            title="닫기"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-6 space-y-2">
            <div className="text-4xl animate-bounce">💖</div>
            <div className="text-base font-black text-[#00227b]">소중한 별점 감사합니다!</div>
            <p className="text-xs text-neutral-600">
              평가 내용이 정상적으로 반영되었습니다.
            </p>
          </div>
        ) : (
          <>
            {/* Title & Info */}
            <div className="mb-2">
              <div className="text-sm font-black text-blue-950">
                {trigger === 'level_up'
                  ? `🎉 LEVEL ${currentLevel} 달성 기념!`
                  : `게임 종료 (최종 ${currentScore.toLocaleString()}점)`}
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5">
                {trigger === 'level_up'
                  ? '다음 난이도로 넘어가기 전 이번 플레이는 어떠셨나요?'
                  : '이번 판의 난이도와 재미는 어떠셨나요?'}
              </p>
            </div>

            {/* Star Rating Selector */}
            <div className="bg-white/80 border border-neutral-300 rounded-xs p-2 mb-2.5">
              <div className="flex items-center justify-center space-x-1 mb-1">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <button
                    key={starIdx}
                    type="button"
                    onMouseEnter={() => setHoverStars(starIdx)}
                    onMouseLeave={() => setHoverStars(null)}
                    onClick={() => setStars(starIdx)}
                    className="p-1 text-2xl transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-hidden"
                  >
                    <span
                      className={
                        starIdx <= activeStarCount
                          ? 'text-amber-400 drop-shadow-[0_1px_2px_rgba(217,119,6,0.6)]'
                          : 'text-neutral-300'
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <div className="text-xs font-bold text-amber-700 min-h-[18px]">
                {getStarLabel(activeStarCount)}
              </div>
            </div>

            {/* Quick Feedback Tags */}
            <div className="text-left mb-2.5">
              <span className="text-[10px] font-bold text-neutral-600 block mb-1">
                좋았던 점을 선택해주세요 (복수 선택 가능)
              </span>
              <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto pr-0.5">
                {FEEDBACK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[10px] px-1.5 py-0.5 rounded-xs border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0055ea] text-white border-[#00227b] font-bold shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Input */}
            <div className="text-left mb-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="한 줄 의견 (선택사항, 예: 더 많은 보석 추가!)"
                className="w-full text-xs px-2 py-1 bg-white border border-neutral-400 rounded-xs placeholder:text-neutral-400 text-neutral-800 focus:outline-hidden focus:border-[#0055ea]"
                maxLength={60}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-1.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-1.5 bg-[#d8d4cc] hover:bg-[#ccc] text-neutral-700 font-bold text-xs rounded-xs border border-[#888] cursor-pointer active:scale-98"
              >
                다음에 하기
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-2 py-1.5 bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-bold text-xs rounded-xs shadow-md border border-blue-950 cursor-pointer active:scale-98 transition-transform"
              >
                별점 제출하기 ★
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

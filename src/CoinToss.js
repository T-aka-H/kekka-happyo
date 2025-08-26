import React, { useState, useEffect } from 'react';

const CoinToss = ({ onNavigateToResults }) => {
  const defaultTeams = ['インサイトエッジ', 'データサイエンスチーム'];
  
  const [teams, setTeams] = useState(defaultTeams);
  const [showSettings, setShowSettings] = useState(false);
  const [tempTeams, setTempTeams] = useState([...defaultTeams]);
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [selectedSide, setSelectedSide] = useState('heads'); // 'heads' or 'tails'
  const [isFlipping, setIsFlipping] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [result, setResult] = useState(null); // 'heads' or 'tails'
  const [winner, setWinner] = useState(null);
  const [coinDisplay, setCoinDisplay] = useState('tails'); // 'heads' or 'tails' - 表示用の状態（初期は裏面）
  const [showResult, setShowResult] = useState(false);

  // コインの表裏を切り替える関数
  const flipCoinDisplay = () => {
    setCoinDisplay(coinDisplay === 'heads' ? 'tails' : 'heads');
  };

  const startCoinToss = () => {
    // ステップ1: コインアップ（ズームイン）
    setIsZoomedIn(true);
    
    setTimeout(() => {
      // ステップ2: 回転開始
      setIsFlipping(true);
      
      setTimeout(() => {
        // ステップ3: ブラックアウト
        setIsBlackout(true);
        
        // 結果決定
        const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
        setResult(coinResult);
        
        // 勝者決定
        const isCorrect = selectedSide === coinResult;
        setWinner(isCorrect ? selectedTeam : (selectedTeam === 0 ? 1 : 0));
        
        setTimeout(() => {
          // ステップ4: 結果表示
          setIsBlackout(false);
          setIsZoomedIn(false);
          setIsFlipping(false);
          setShowResult(true);
        }, 500); // 0.5秒のブラックアウト
      }, 3000); // 3秒の回転
    }, 500); // 0.5秒のズームイン
  };

  const reset = () => {
    setResult(null);
    setWinner(null);
    setShowResult(false);
    setIsFlipping(false);
    setIsZoomedIn(false);
    setIsBlackout(false);
  };

  const saveSettings = () => {
    setTeams([...tempTeams]);
    setShowSettings(false);
  };

  const cancelSettings = () => {
    setTempTeams([...teams]);
    setShowSettings(false);
  };

  const updateTeamName = (index, name) => {
    const newTempTeams = [...tempTeams];
    newTempTeams[index] = name;
    setTempTeams(newTempTeams);
  };

  const goToContestResults = () => {
    if (onNavigateToResults) {
      onNavigateToResults();
    } else {
      alert('審査結果発表アプリに移動します\n（実装時にはContestResultsコンポーネントを表示）');
    }
  };

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 border-4 border-gray-600 max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">チーム設定</h2>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">チーム名</h3>
            <div className="space-y-3">
              {tempTeams.map((team, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-400 w-16">チーム{index + 1}:</span>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => updateTeamName(index, e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={cancelSettings}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              キャンセル
            </button>
            <button
              onClick={saveSettings}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              設定を保存
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-auto ${isBlackout ? 'bg-black' : ''}`}>
      {/* ブラックアウト画面 */}
      {isBlackout && (
        <div className="fixed inset-0 bg-black z-50"></div>
      )}

      {/* 背景ロゴ */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10"
        style={{
          backgroundImage: "url('./logo.jpg')"
        }}
      ></div>
      
      {/* アニメーション定義 */}
      <style>{`
        @keyframes coinFlip {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          25% { transform: rotateY(450deg) rotateX(180deg); }
          50% { transform: rotateY(900deg) rotateX(360deg); }
          75% { transform: rotateY(1350deg) rotateX(540deg); }
          100% { transform: rotateY(1800deg) rotateX(720deg); }
        }
        
        @keyframes zoomIn {
          0% { transform: scale(1); }
          100% { transform: scale(5); }
        }
      `}</style>

      {/* 設定ボタン */}
      <div
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full text-xs z-30 cursor-pointer"
      >
        ⚙️
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 p-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* タイトル */}
          
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-wider">
            COIN TOSS
          </h1>

          {/* コイン表示エリア */}
          <div className="mb-6 flex justify-center">
            <div 
              className={`w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full flex items-center justify-center shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                isZoomedIn ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 scale-150' : ''
              }`}
              style={{
                animation: isFlipping && isZoomedIn ? 'coinFlip 3s ease-out' : isZoomedIn ? 'zoomIn 0.5s ease-out forwards' : 'none'
              }}
              onClick={!isFlipping && !showResult && !isZoomedIn ? flipCoinDisplay : undefined}
            >
              {isFlipping ? (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-8xl md:text-9xl lg:text-[10rem] font-bold">
                  🪙
                </div>
              ) : (
                <img 
                  src={showResult ? 
                    (result === 'heads' ? './heads.jpg' : './tails.jpg') : 
                    (coinDisplay === 'heads' ? './heads.jpg' : './tails.jpg')
                  } 
                  alt={showResult ? 
                    (result === 'heads' ? 'Heads' : 'Tails') : 
                    (coinDisplay === 'heads' ? 'Heads' : 'Tails')
                  }
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>
          </div>

          {/* 二段目：チーム選択とコール選択を左右に */}
          {!showResult && !isFlipping && (
            <>
              <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto mb-6">
                {/* 左側：チーム選択 */}
                <div className="flex-1 bg-gray-800 bg-opacity-60 rounded-2xl p-4 border border-gray-600">
                  <h3 className="text-lg font-medium mb-3 text-gray-300">コールするチーム</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {teams.map((team, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTeam(index)}
                        className={`flex-1 px-4 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
                          selectedTeam === index
                            ? 'bg-yellow-500 text-black shadow-lg scale-105'
                            : 'bg-transparent border-2 border-gray-500 text-gray-300 hover:border-yellow-500 hover:text-yellow-400'
                        }`}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 右側：Head/Tails選択（選択チームに連動） */}
                <div className="flex-1 bg-gray-800 bg-opacity-60 rounded-2xl p-4 border border-gray-600">
                  <h3 className="text-lg font-medium mb-3">
                    <span className="text-yellow-400">{teams[selectedTeam]}</span><span className="text-gray-300"> のコール</span>
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedSide('heads')}
                      className={`flex-1 px-4 py-3 rounded-full font-bold text-lg transition-all duration-200 ${
                        selectedSide === 'heads'
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-transparent border-2 border-gray-500 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                      }`}
                    >
                      HEADS (表)
                    </button>
                    <button
                      onClick={() => setSelectedSide('tails')}
                      className={`flex-1 px-4 py-3 rounded-full font-bold text-lg transition-all duration-200 ${
                        selectedSide === 'tails'
                          ? 'bg-green-500 text-white shadow-lg scale-105'
                          : 'bg-transparent border-2 border-gray-500 text-gray-300 hover:border-green-500 hover:text-green-400'
                      }`}
                    >
                      TAILS (裏)
                    </button>
                  </div>
                </div>
              </div>

              {/* 三段目：コイントス開始ボタン - コインの真下 */}
              <div className="mb-20 flex justify-center">
                <button
                  onClick={startCoinToss}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  TOSS COIN
                </button>
              </div>
            </>
          )}

          {/* 結果表示 */}
          {showResult && (
            <div className="text-center animate-pulse pb-20">
              <div className="text-2xl font-bold mb-3 text-yellow-400">
                結果: {result === 'heads' ? '表 (Heads)' : '裏 (Tails)'}
              </div>
              <div className="text-lg mb-4 text-gray-300">
                <span className="text-yellow-400">{teams[selectedTeam]}</span>のコール: {selectedSide === 'heads' ? '表 (Heads)' : '裏 (Tails)'}
              </div>
              
              {/* 結果表示：選択権獲得ボックス */}
              <div className="bg-gray-800 rounded-lg p-4 border-4 border-yellow-400 mb-4 mx-2">
                <div className="text-2xl font-bold mb-1 text-yellow-400">
                  🎯 選択権獲得 🎯
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-1">
                  {teams[winner]}
                </div>
                <div className="text-base text-gray-300">
                  先攻・後攻を選択してください
                </div>
              </div>

              
              <button
                onClick={reset}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                もう一度コイントス
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 審査結果発表アプリへのリンク - 右下 */}
      <button
        onClick={goToContestResults}
        className="fixed bottom-2 right-4 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-300 px-3 py-2 rounded text-sm opacity-60 hover:opacity-80 z-20"
      >
        審査結果発表
      </button>

      {/* クレジット表示 - 最下部に固定 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 text-center text-sm text-gray-400 py-2 z-10">
        developed by T.H. Data Science Team 2025
      </div>
    </div>
  );
};

export default CoinToss;
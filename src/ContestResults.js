import React, { useState, useEffect } from 'react';

const ContestResults = () => {
  const defaultTeams = ['インサイトエッジ', 'データサイエンスT'];
  const defaultJudges = [
    '田中',
    '佐藤', 
    '鈴木',
    '高橋',
    '伊藤',
    '渡辺',
    '山田'
  ];

  const [teams, setTeams] = useState(defaultTeams);
  const [judges, setJudges] = useState(defaultJudges);
  const [showSettings, setShowSettings] = useState(false);
  const [tempTeams, setTempTeams] = useState([...defaultTeams]);
  const [tempJudges, setTempJudges] = useState([...defaultJudges]);

  // 各審査員の投票結果（0: インサイトエッジ, 1: データサイエンスT）
  const [votes, setVotes] = useState([0, 1, 0, 0, 1, 0, 1]); // 例：4-3でインサイトエッジ勝利

  const [currentJudgeIndex, setCurrentJudgeIndex] = useState(-1);
  const [revealedVotes, setRevealedVotes] = useState({});
  const [isRevealing, setIsRevealing] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [teamScores, setTeamScores] = useState([0, 0]);

  const startReveal = () => {
    setCurrentJudgeIndex(-1);
    setRevealedVotes({});
    setIsRevealing(true);
    setShowFinal(false);
    setTeamScores([0, 0]);
  };

  const saveJudges = () => {
    setTeams([...tempTeams]);
    setJudges([...tempJudges]);
    // 投票結果配列も審査員数に合わせて調整
    const newVotes = [...votes];
    while (newVotes.length < tempJudges.length) {
      newVotes.push(Math.floor(Math.random() * 2)); // ランダムに投票結果を追加
    }
    while (newVotes.length > tempJudges.length) {
      newVotes.pop(); // 余分な投票結果を削除
    }
    setVotes(newVotes);
    setShowSettings(false);
  };

  const cancelSettings = () => {
    setTempTeams([...teams]);
    setTempJudges([...judges]);
    setShowSettings(false);
  };

  const updateTeamName = (index, name) => {
    const newTempTeams = [...tempTeams];
    newTempTeams[index] = name;
    setTempTeams(newTempTeams);
  };

  const updateJudgeName = (index, name) => {
    const newTempJudges = [...tempJudges];
    newTempJudges[index] = name;
    setTempJudges(newTempJudges);
  };

  const addJudge = () => {
    setTempJudges([...tempJudges, '新審査員']);
  };

  const removeJudge = (index) => {
    if (tempJudges.length > 1) {
      const newTempJudges = tempJudges.filter((_, i) => i !== index);
      setTempJudges(newTempJudges);
    }
  };

  const toggleVote = (judgeIndex) => {
    const newVotes = [...votes];
    newVotes[judgeIndex] = newVotes[judgeIndex] === 0 ? 1 : 0;
    setVotes(newVotes);
  };

  useEffect(() => {
    if (isRevealing && currentJudgeIndex < judges.length - 1) {
      const timer = setTimeout(() => {
        const nextIndex = currentJudgeIndex + 1;
        const vote = votes[nextIndex];
        
        setCurrentJudgeIndex(nextIndex);
        setRevealedVotes(prev => ({ ...prev, [nextIndex]: vote }));
        
        // スコア更新
        setTeamScores(prev => {
          const newScores = [...prev];
          newScores[vote]++;
          return newScores;
        });

        // 全員発表完了
        if (nextIndex === judges.length - 1) {
          setTimeout(() => {
            setShowFinal(true);
            setIsRevealing(false);
          }, 2000);
        }
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [currentJudgeIndex, isRevealing, judges.length, votes]);

  const getWinnerIndex = () => {
    return teamScores[0] > teamScores[1] ? 0 : 1;
  };

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 border-4 border-gray-600 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">審査員設定</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* チーム名入力 */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-300">チーム名</h3>
              <div className="space-y-3">
                {tempTeams.map((team, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-400 w-8">チーム{index + 1}:</span>
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

            {/* 審査員名入力 */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-300">審査員名</h3>
              <div className="space-y-3">
                {tempJudges.map((judge, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-400 w-8">{index + 1}.</span>
                    <input
                      type="text"
                      value={judge}
                      onChange={(e) => updateJudgeName(index, e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                    />
                    <button
                      onClick={() => removeJudge(index)}
                      disabled={tempJudges.length <= 1}
                      className="text-red-400 hover:text-red-300 disabled:text-gray-600 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addJudge}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                審査員を追加
              </button>
            </div>

            {/* 投票結果設定 */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-300">投票結果設定</h3>
              <div className="space-y-3">
                {tempJudges.map((judge, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-3">
                    <span className="text-white">{judge}</span>
                    <button
                      onClick={() => toggleVote(index)}
                      className={`px-4 py-1 rounded text-sm font-semibold ${
                        votes[index] === 0 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      {votes[index] === 0 ? tempTeams[0] : tempTeams[1]}
                    </button>
                  </div>
                ))}
              </div>
              
              {/* 得票数プレビュー */}
              <div className="mt-6 p-4 bg-gray-700 rounded">
                <h4 className="text-lg font-semibold mb-2 text-yellow-400">結果プレビュー</h4>
                <div className="flex justify-between">
                  {teams.map((team, teamIndex) => {
                    const score = votes.slice(0, tempJudges.length).filter(v => v === teamIndex).length;
                    return (
                      <div key={teamIndex} className="text-center">
                        <div className="text-sm text-gray-400">{team}</div>
                        <div className="text-2xl font-bold text-white">{score}票</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={cancelSettings}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              キャンセル
            </button>
            <button
              onClick={saveJudges}
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-4 relative">
      {/* 背景ロゴ */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10"
        style={{
          backgroundImage: "url('./logo.jpg')"
        }}
      ></div>
      <style>{`
        @keyframes spinAndSettle {
          0% { transform: rotateY(0deg); }
          20% { transform: rotateY(360deg); }
          40% { transform: rotateY(720deg); }
          60% { transform: rotateY(900deg); }
          80% { transform: rotateY(1080deg); }
          100% { transform: rotateY(1080deg); }
        }
      `}</style>

      {/* 設定ボタン */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute bottom-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full text-xs"
      >
        ⚙️
      </button>

      {/* 審査員投票結果メイン表示 */}
      <div className="w-full max-w-7xl flex items-center justify-center">
        {/* 左側：インサイトエッジ得票数 */}
        <div className="text-center mr-8">
          <div className="text-8xl font-bold text-yellow-400">
            {teamScores[0]}
          </div>
        </div>

        {/* 審査員と投票結果 - 画面中央に大きく表示 */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          {judges.map((judge, judgeIndex) => (
            <div key={judgeIndex} className="text-center">
              {/* 投票結果表示エリア - さらに大型化 */}
              <div className="w-24 h-80 border-4 border-gray-600 rounded-lg bg-gray-700 flex flex-col justify-center items-center relative mb-4">
                {revealedVotes[judgeIndex] !== undefined && (
                  <div 
                    className={`text-3xl font-bold ${
                      currentJudgeIndex === judgeIndex ? 'text-yellow-400 text-4xl' : 'text-white'
                    }`}
                    style={{ 
                      writingMode: 'vertical-rl', 
                      textOrientation: 'upright',
                      animation: currentJudgeIndex === judgeIndex ? 'spinAndSettle 3s ease-out' : 'none'
                    }}
                  >
                    {revealedVotes[judgeIndex] === 0 ? teams[0].replace('T', '') : teams[1].replace('T', '')}
                  </div>
                )}
                
                {/* 現在発表中のハイライト */}
                {currentJudgeIndex === judgeIndex && !showFinal && (
                  <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg animate-pulse"></div>
                )}
              </div>

              {/* 審査員名 */}
              <div className="text-lg font-semibold text-gray-300">
                {judge}
              </div>
            </div>
          ))}
        </div>

        {/* 右側：データサイエンスT得票数 */}
        <div className="text-center ml-8">
          <div className="text-8xl font-bold text-yellow-400">
            {teamScores[1]}
          </div>
        </div>
      </div>

      {/* コントロールエリア */}
      <div className="text-center">
        {!isRevealing && !showFinal && (
          <button
            onClick={startReveal}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            結果発表開始
          </button>
        )}

        {isRevealing && currentJudgeIndex >= 0 && (
          <div className="bg-gray-800 rounded-lg p-4 border-2 border-yellow-400">
            <div className="text-lg mb-2 text-gray-400">
              {judges[currentJudgeIndex]}の投票先は...
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {votes[currentJudgeIndex] === 0 ? teams[0].replace('T', '') : teams[1].replace('T', '')}
            </div>
          </div>
        )}

        {/* 最終結果 */}
        {showFinal && (
          <div className="text-center animate-pulse">
            <div className="text-4xl font-bold mb-6 text-yellow-400">
              🏆 優勝 🏆
            </div>
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
              {getWinnerIndex() === 0 ? teams[0] : (teams[1].endsWith('T') ? teams[1].slice(0, -1) + 'チーム' : teams[1])}
            </div>
            <div className="text-2xl text-gray-300 mb-8">
              {teamScores[getWinnerIndex()]}票獲得
            </div>
            <button
              onClick={startReveal}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              もう一度見る
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestResults;
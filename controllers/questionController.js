const { QuestionList, ZKQuestionList } = require('../constants/questions');

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

module.exports = async (req, res) => {
  /*
  const questions = QuestionList.split('/ ')
    .slice(1)
    .map((question, ind) => {
      const list = question.split('\n');
      let answers =
        ind < 51
          ? list
              .slice(1)
              .filter((item) => !!item.trim().length)
              .map((item, index) => {
                let result = item.trim();
                return result;
              })
              .slice(0, -1)
          : list
              .slice(1)
              .filter((item) => !!item.trim().length)
              .map((item, index) => {
                let result = item.trim();
                return result;
              });
      return {
        correct: Number(list[0][list[0].length - 1]),
        title: list[0].slice(0, list[0].length - 1),
        answers,
      };
    });
    */
  const questions = ZKQuestionList;
  shuffle(questions);
  shuffle(questions);

  res.status(200).json({ questions: questions.slice(0, 10) });
};

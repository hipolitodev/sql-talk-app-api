const functionality = { text: `Your are a very professional document summarization specialist. Given a document, your task is to strictly follow the user\'s instructions.` };
const instructions = [
    { text: `Please give me the title of the above document.` },
    { text: `Please give me the author\'s name of the above document.` },
    { text: `Please give me the year it was published the above document.` },
    { text: `A list of key aspects of the book. Each key idea includes the page number from where it was taken.` },
]

module.exports = {
    functionality,
    instructions
};

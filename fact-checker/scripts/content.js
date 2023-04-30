const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

const allowedSubreddits = ["r/todayilearned", "r/YouShouldKnow"]

// Checks whether the page is a subreddit page
var subredditPage = document.querySelector("[class^='subredditvars']");
if (subredditPage) {
    var subreddit = document.querySelector("h2");
    console.error(subreddit)

    var currentSubreddits = JSON.parse(localStorage.getItem("subreddits")) || [];
    if (!(currentSubreddits.includes(subreddit.textContent))) {
      var addButton = document.createElement("button");
      addButton.textContent = "Add to FactCheck";
      addButton.classList.add('add-button');
      addButton.addEventListener("click", addSubreddit(subreddit.textContent));
      subreddit.insertAdjacentElement("afterend", addButton);
    } else {
      var removeButton = document.createElement("button");
      removeButton.textContent = "Remove from FactCheck";
      removeButton.classList.add('remove-button');
      removeButton.addEventListener("click", removeSubreddit(subreddit.textContent));
      subreddit.insertAdjacentElement("afterend", removeButton);
    }
    
} 

// Checks whether the page is an individual post
var post = document.querySelector("[id^='post-title']");
if (post) {
    const subreddit = document.querySelector(".subreddit-name").textContent.trim().split(" ")[0].trim();
    if (allowedSubreddits.includes(subreddit)) {
        var title = document.querySelector("[id^='post-title']");

        var verdict = document.createElement("p");
        verdict.classList.add('verdict')
    
        factCheck(title.textContent).then(result => {
            verdict.innerHTML = `<strong> FactChecker says: </strong>`;
            verdict.innerHTML += `${result}`;
    
            if (result.toLowerCase().includes("true") && !(result.toLowerCase().includes("not true"))) {
                verdict.classList.add('true');
            } else {
                verdict.classList.add('false');
            }
          });
          (title).insertAdjacentElement("afterend", verdict);3
    }
}


function addSubreddit(subreddit) {
    return function() {
        var subreddits = JSON.parse(localStorage.getItem("subreddits")) || [];
        subreddits.push(subreddit); 
        localStorage.setItem("subreddits", JSON.stringify(subreddits));
    }
}

function removeSubreddit(subreddit) {
  return function() {
      var subreddits = JSON.parse(localStorage.getItem("subreddits")) || [];
      const index = subreddits.indexOf(subreddit);
      subreddits.splice(index, 1);
      localStorage.setItem("subreddits", JSON.stringify(subreddits));
  }
}

async function factCheck(sentence) {
  const prompt = `Is the following statement true or false? ${sentence} Explicitly include either "true" or "false", and elaborate with one or more sentences with reasons to support your conclusion. Do not simply answer 'true' or 'false'.`;
  const requestBody = {
    prompt,
    max_tokens: 1024,
    n: 1,
    stop: null,
    temperature: 0.5,
  };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });
  const responseBody = await response.json();
  const result = responseBody.choices[0].text.trim();
  return result;
}

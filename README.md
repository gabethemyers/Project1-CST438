# Project 01 Retrospective and overview

[👉  Our GitHub Repo](https://github.com/your-username/your-repo-name)

## Overview
This application is a deck builder for the mobile game, Clash Royale, which makes use
of the API found here, provided by Supercell, the developer of Clash Royale.

## Introduction
- Communication was managed by the use of Slack, in-class time, and meetings.
- Originally, we had 23 stories/issues, with a couple of them being nice-to-have
  features.
- We ended up completing a total of 19 stories/issues between the four of us, with
  a few new stories being created, while others were merged.

---

## Team Retrospective

---

### Juan Zavala
1. Juan’s pull requests are found here.  
2. Juan’s issues are found here.  

What was your role / which stories did you work on  
Juan worked on setting up the Login page using the helper functions that Gabriel
created to connect to the database. He also worked on creating a screen that shows the
top 50 players for every season, and also worked on a player detail screen that shows
up once a player is clicked on. He also worked on implementing a screen that allows the
user to search for and see information on a player using the player's player tag.  

- **What was the biggest challenge?**  
  Getting the top players' screen working.  

- **Why was it a challenge?**  
  The reason is that Juan had many ideas of letting the players choose
  different seasons and locations, but the API endpoint for the locations
  ended up not working, and the season endpoint was also giving errors for
  some seasons and not for others. To address the issue, he had to discard
  allowing locations to be chosen, and then had to find the last remaining
  working season, which happened to be September 2022, so he had to
  then make sure that the last season the user could choose from.  

- **Favorite / most interesting part of this project**  
  Juan’s favorite part of the project was working with all the information from
  the API, because, as someone who has been playing the game on and off
  for 9 years, being able to make a project on it allowed him to be a lot more
  motivated to work on this project.  

- **If you could do it over, what would you change?**  
  If Juan could do it over, he would take a more in-depth look at the
  documentation of the API because, as mentioned previously, he had some
  ideas that couldn’t be implemented because of some of the API endpoints
  not working.  

- **What is the most valuable thing you learned?**  
  The most valuable thing Juan learned was how important it is for everyone
  to keep their branch updated with the main. We have instances where that
  wasn’t done, which caused merge conflicts that took time to solve.  

---

### Jorge Barrera
1. Jorge’s pull requests are [here](https://github.com/gabethemyers/Project1-CST438/issues?q=is%3Aclosed%20is%3Apr%20author%3AJorgeBarr983)  
2. Jorge’s Github issues are [here](https://github.com/gabethemyers/Project1-CST438/issues?q=is%3Aissue%20assignee%3AJorgeBarr983)  

What was your role / which stories did you work on  
In this project, Jorge was responsible for implementing several key features related to
the cards functionality. First, he worked on integrating the Clash Royale API to fetch and
display cards on the cards page. He then developed the filtering system, which allows
users to narrow down cards based on specific criteria (such as rarity or type). Finally, he
made each card clickable so that users can select a card and view its detailed
information on a separate screen.  

- **What was the biggest challenge?**  
  Retrieving API information.  

- **Why was it a challenge?**  
  Jorge had no prior experience with React Native and TypeScript, which
  made working with API calls more difficult compared to JavaScript.  

- **How was the challenge addressed?**  
  He addressed this challenge by researching how to make API calls in
  React Native, consulting documentation, and using tutorials to follow best
  practices.  

- **Favorite / most interesting part of this project**  
  Getting all of the information from the API card endpoint to display on the
  screen.  

- **If you could do it over, what would you change?**  
  I would make sure the API actually provides the data I expect, test it
  thoroughly before committing to it, and verify that its parameters function
  as intended.  

- **What is the most valuable thing you learned?**  
  The most valuable thing I learned was how to collaborate effectively on a
  group project — dividing work evenly, staying organized, and using GitHub
  to coordinate contributions.  

---

### Gabriel Myers
- Gabriel’s pull requests can be found here  
- Gabriel’s github issues can be found here  

What was your role / which stories did you work on  

- **What was the biggest challenge?**  
  The biggest challenge for me was setting up the database and creating the
  tables.  

- **Why was it a challenge?**  
  It was challenging because I was having trouble getting my android emulator to
  work. I was eventually able to find an emulator that would connect to expo and
  after that I was able to test if my code was working or not. I was also stuck on
  how to map the relationship between cards and a deck.  

- **Favorite / most interesting part of this project**  
  My favorite part was making the deck builder screen and setting up that to work
  with the cards page. It went very smoothly because I had my database helper
  functions already setup. It was a fun challenge to find the best way to display
  decks.  

- **If you could do it over, what would you change?**  
  I would change how much time I spent on the database and would instead spend
  more time doing front-end stuff.  

- **What is the most valuable thing you learned?**  
  The most valuable thing I learned from this was how to work in a team and use
  github to do it effectively. I didn't have a complete understanding of pull requests,
  branches, issues, and the proper way to do all these things. Now I understand
  how to do those things and why.  

---

### Daniel Loya
1. Daniel’s pull requests are found here.  
2. Daniel’s issues are found here.  

What was your role / which stories did you work on  
Daniel worked on getting the landing page set up and using the card information that
was retrieved from the Clash Royale API and stored in the database to create
recommended decks for different arenas.  

- **What was the biggest challenge?**  
  Getting the transition once the button is pressed to go to a different screen
  with the deck information.  

- **Why was it a challenge?**  
  The reason is that Daniel had this challenge because originally he wanted
  to make the image of the arena also be pressable, but was having trouble
  getting it to work. Click the button/label was working, but not the image.  

- **Favorite / most interesting part of this project**  
  Daniel’s favorite/most interesting part of the project was getting to work
  with an API for a game that he is familiar with.  

- **If you could do it over, what would you change?**  
  If Daniel could do it over again, he would focus on trying to learn more of
  the basics of TypeScript because that is what caused him some trouble
  when setting up the landing page.  

- **What is the most valuable thing you learned?**  
  The most valuable thing that Daniel learned was how to solve merge
  issues. He had trouble when trying to make pull requests, having merge
  conflicts that needed to be resolved. This gave him valuable experience in
  resolving merge conflicts and learn how to avoid them.  

---

## Conclusion

- **How successful was the project?**  
  The project was pretty successful; all the main features that we wanted to
  implement were implemented, and while some could have been done
  better, we are happy with what we were able to do.  

- **What was the largest victory?**  
  The largest victory was storing the information of all the cards in a
  database locally and then creating helper functions to get access to those
  cards in an easy manner whenever they are needed.  

### Final assessment of the project
Overall, the project was a success. We set out to create a Clash Royale deck
builder application with login/signup functionality, card browsing and filtering, deck
management, and player leaderboard features. By the end of the project, all core
features were implemented and functioning. We met most of the user stories planned
and were able to adapt down due to API limitations, and create an app that we are
proud of.  

---

## Areas for Improvement
- Keeping branches up to date with main more consistently to avoid merge
  conflicts.
- Spending more time up front validating API endpoints and planning fallback
  strategies.
- Improving test coverage earlier, adding unit tests with the PR of the screen
  made, and updating the tests as needed.  

---

## Key Takeaways
- The value of communication and synchronization in a group project cannot be
  overstated.
- API documentation can sometimes be misleading or outdated — testing
  endpoints early is critical.
- Handling merge conflicts smoothly requires discipline in branching and frequent
  pulls from main.  

---

## Final Thoughts
The project delivered on its main goals and gave the team practical experience working
with React Native, Expo, TypeScript, GitHub collaboration, and third-party APIs, which,
before this, none of us had experience with. It was both a technical and organizational
learning experience that replicates, in a way, how projects are worked on in the industry
and allows us to start good practices.


class Habit{
  constructor( name,completed = false, streak = 0, type) {
    this.id = new Date() + Math.random(),
    this.name = name,
    this.completed = completed,
    this.streak = streak,
    this.type = type
    }

    getCompleted(){
      return this.completed
    }

    getStreak(){
      return this.streak
    }
}

class HabitManager{
  #habits = [];

  addHabits(name, completed , streak){
    let habits = new Habit(name , completed , streak)
    this.#habits.push(habits)
  }

  deleteHabits(id){
    this.#habits = this.#habits.filter(d => d.id !== id)
  }

  streakCount(){
    let streak = this.getStreak()
    if(this.getCompleted() === true){
      streak++
    } 
  }

  filtering(filter){
    let habit = this.getHabits()
    if(filter === "Health"){
      return habit.filter(f => f.type === "Health" )
    } else if(filter === "Fitness"){
      return habit.filter(f => f.type === "Fitness")
    } else if(filter === "Learning"){
      return habit.filter(f => f.type === "Learning")
    } else if(filter === "Productivity"){
      return habit.filter(f => f.type === "Productivity")
    } else if(filter === "DailtHabits"){
      return this.#habits.filter(f => f.type === "DailyHabits")
    }
    
    return habit;
  }

  
  getHabits(){
    return [...this.#habits]
  }

  totalHabits(){
    let total = 0
    this.#habits = this.#habits.filter(f => f.addHabits().length > 0);
    total++
  };

  completedHabitsCount(){
    let count = 0;
    if(this.getCompleted() === true){
      count++
    }
  }


  

}

class UIRenderer{
  constructor(manager) {
    this.manager = manager
  }


  renderProgressBar(){
    let progress = document.getElementById("progress");
    let progressValue = document.getElementById("progressValue");

    let habit = this.manager.getHabits()
    let total = habit.length;
    let completed = habit.filter(f => f.getCompleted()).length;
    let percent = total ? Math.round((completed) * 1) : 0;
    progress.style.width = percent + "/30"
    progressValue.textContent = percent + "/30"
  }

  renderhabitsList(filter = "all"){
    let habitsList = document.getElementById("habitsList");
    let habits = this.manager.getHabits();
    let filters = this.manager.filtering(filter);

    if(filters.length === 0){
    habitsList.innerHTML = filters.map(filter => `
      <div class="emptystorage">
      <h2 class="emptystorage">No Habit ${filter === "All" ? "yet" : "here"}</h2>
      <p class="emptyPara">${filter === "Health" || filter === "Fitness" || filter === "Learning" || filter === "Productivity" || filter === "DailyHabits" ? "no habit in this type" : "add your daily habits to track"}</p>
      </div>
      `)
      return
    }

    habitsList.innerHTML = `
    <div class="habitsStore>
    ${habits.map(habit => `
      <div class="habitStore1>
      <h2>${habit.name}</h2>
      <h4>${habit.type}</h4>
      <h4>${habit.streak} Days</h4>
      </div>
      <div class="habitButton>
      <button data-id="${habit.completed}" id="completedMark">Mark Complete</button>
      <button id="deleteBtn" data-id="${habit.id}">Delete</button>
      </div>
      <div id="progressBar">
      <div id="progress"></div>
      <p id="progressValue">
      </div>
      `).join('')}
    </div>
    `
  };

  rendercounter(){
    let total = document.getElementById("totalHabitsBox");
    let completed = document.getElementById("CompletedBox");
    let streak = document.getElementById("streakBox");

    let totalHabits = this.manager.totalHabits();
    let totalcompleted = this.manager.completedHabitsCount();
    let streakcount = this.manager.streakCount();

    total.textContent = `${totalHabits}`;
    completed.textContent = `${totalcompleted}/ ${totalHabits}`;
    streak.textContent = `${streakcount} Days`;
  }

  renderAll(){
    this.renderhabitsList();
    this.renderProgressBar();
    this.rendercounter();
  }
}



class Habit{
  constructor( name, type) {
    this.id =  Date.now() + Math.random(),
    this.name = name,
    this.completed = [],
    this.streak = 0,
    this.type = type,
    this.createDate = new Date().toDateString()
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

  addHabits(name,type){
    let habits = new Habit(name ,type)
    this.#habits.push(habits)
  }

  deleteHabits(id){
    this.#habits = this.#habits.filter(d => d.id !== id)
  }

  markComplete(habitId){
    const habit = this.#habits.find(f => f.id === habitId);
    if(!habit) return;

    const today = new Date().toDateString();
    if(habit.completed.includes(today)){
      alert("already completed today!")
      return;
      
    }
    habit.completed.push(today);
    
    this.calculateStreak(habitId)
  };
  
  calculateStreak(habitId){
    let habit = this.#habits.find(f => f.id === habitId);
    
    if(!habit || habit.completed.length === 0){
      habit.streak = 0
      return;
    };
    
    let streak = 0
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      if(habit.completed.includes(checkDate.toDateString())){
        streak++;
        
      } else{
        break;
      }
    }
    habit.streak = streak;
  };
  
  isCompletedToday(habitId){
  const habit = this.#habits.find(f => f.id === habitId);
  if(!habit) return false;
  
  const today = new Date().toDateString();
  let returning = habit.completed.includes(today);

  return returning
}


filtering(filter){
  let habit = this.getHabits()
  if(filter === "health"){
    return habit.filter(f => f.type === "health" )
    } else if(filter === "fitness"){
      return habit.filter(f => f.type === "fitness")
    } else if(filter === "learning"){
      return habit.filter(f => f.type === "learning")
    } else if(filter === "productivity"){
      return habit.filter(f => f.type === "productivity")
    } else if(filter === "dailyHabits"){
      return habit.filter(f => f.type === "dailyHabits")
    }
    
    return habit;
  }
  
  
  
  totalHabits(){
    return this.#habits.length;
  };
  
  completedHabitsCount(){
    const today = new Date().toDateString();
    return this.#habits.filter(f => f.completed.includes(today)).length;
  };
  
  getBestStreak(){
    if(this.#habits.length === 0) return 0;
    return Math.max(...this.#habits.map(h => h.streak));
  }
  
  getHabits(){
    return [...this.#habits]
  }

  saveLocalStorage(){
    localStorage.setItem("habit" , JSON.stringify(this.#habits))
  }

  loadLocalStorage(){
    let data = localStorage.getItem("habit");

    if(data){
      this.#habits = JSON.parse(data)
    }
  }

  

}

class UIRenderer{
  constructor(manager) {
    this.manager = manager
  }


  renderhabitsList(filter = "all"){
    let habitsList = document.getElementById("habitsList");
    let filters = this.manager.filtering(filter);

    if(filters.length === 0){
    habitsList.innerHTML =  `
      <div class="emptystorage">
      <h2 >No Habit ${filter === "ll" ? "yet" : "here"}</h2>
      <p class="emptyPara">${filter === "health" || filter === "fitness" || filter === "learning" || filter === "productivity" || filter === "dailyHabits" ? "no habit in this type" : "add your daily habits to track"}</p>
      </div>
      `
      return
    }

    habitsList.innerHTML = filters.map(habit => {
      const completedToday = this.manager.isCompletedToday(habit.id);
      const completionPercent = Math.round((habit.completed.length / 30) * 100);

      return `
       <div class="habit-card ${completedToday ? 'completed' : ''}">
          <div class="habit-header">
            <h3>${habit.name}</h3>
            <div class="habit-actions">
              <button class="btn-complete ${completedToday ? 'completed' : ''}" 
                      data-id="${habit.id}">
                ${completedToday ? '✓ Done Today' : 'Mark Complete'}
              </button>
              <button class="btn-delete" data-id="${habit.id}">🗑️</button>
            </div>
          </div>
          <div class="habit-info">
            <span class="habit-streak">🔥 Streak: ${habit.streak} days</span>
            <span class="date">${habit.createDate}</span>
          </div>
          <div class="habit-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${completionPercent}%"></div>
            </div>
            <span class="progress-text">${habit.completed.length}/30 days</span>
          </div>
        </div>
      `;
    }).join('');
  };

  rendercounter(){
    let total = document.querySelector("#totalHabitsBox h2");
    let completed = document.querySelector("#CompletedBox h2");
    let streak = document.querySelector("#streakBox h2");

    let totalHabits = this.manager.totalHabits();
    let totalcompleted = this.manager.completedHabitsCount();
    let streakcount = this.manager.getBestStreak();

    total.textContent = `${totalHabits}`;
    completed.textContent = `${totalcompleted}/ ${totalHabits}`;
    streak.textContent = `${streakcount} Days`;
  }

  renderAll(){
    this.renderhabitsList();
    this.rendercounter();
  }
}


class App{
  constructor() {
    this.manager = new HabitManager();
    this.renderer = new UIRenderer(this.manager)
    this.currentFilter = "all";

    this.saveEventListener()
  }

  saveEventListener(){
    document.getElementById("addHabit").addEventListener("click" , () =>{
      let input = document.getElementById("habitInput")
      let select = document.getElementById("selectCategory")
      let name = input.value.trim();
      let category = select.value;

      if(!name){
        alert("please first enter the habit");
        return
      }

      this.manager.addHabits(name , category);
      this.manager.saveLocalStorage();
      input.value = "";
      this.renderer.renderAll();
    });

    document.getElementById("habitsList").addEventListener("click" , (e)=>{
      if(e.target.classList.contains("btn-complete")){
        let id = parseFloat(e.target.dataset.id);
        this.manager.markComplete(id);
        this.manager.saveLocalStorage();
        this.renderer.renderhabitsList(this.currentFilter);
        this.renderer.rendercounter();
      };

      if(e.target.classList.contains('btn-delete')){
        let id = parseFloat(e.target.dataset.id);
        this.manager.deleteHabits(id);
        this.manager.saveLocalStorage();
        this.renderer.renderAll();
      }
    })

    document.querySelector(".filtered").addEventListener("click" , (e) =>{

      if(e.target.classList.contains("filter")){
        this.currentFilter = e.target.dataset.filter

        document.querySelectorAll(".filter").forEach(button => {
          button.classList.remove("active")
        });

        e.target.classList.add("active");

        this.renderer.renderhabitsList(this.currentFilter)
      }
    } )


  }


}


let app = new App();
app.renderer.renderAll()
let manager = new HabitManager();
manager.markComplete()
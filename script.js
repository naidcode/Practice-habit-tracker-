class Habit{
  constructor( habit,completed = false, streak = 0, type) {
    this.id = new Date() + Math.random(),
    this.habit = habit,
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

  addHabits(habit, completed , streak){
    let habits = new Habit(habit , completed , streak)
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

  getHabits(){
    return [...this.#habits]
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

  

}

// let habit = new Habit("drink water", true, 1)
// console.log(habit)
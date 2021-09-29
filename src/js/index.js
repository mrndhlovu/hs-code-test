import React from "react"
import ReactDOM from "react-dom"

import "../styles/scss/index.scss"

const Header = ({ headerText }) => {
  return (
    <div className="exercise-header">
      <h2>{headerText}</h2>
    </div>
  )
}

const ExerciseOne = () => {
  return (
    <div>
      <Header headerText="Exercise 1 - Testimonial Block" />
      <div className="testimonial-block">
        <div className="testimonial-block-text">
          <p>
            Gingerbread tart cupcake cake muffin cookie liquorice tiramisu.
            Toffee cupcake cake cake croissant icing carrot cake cookie. Dessert
            chocolate bar apple pie sesame snaps liquorice carrot cake cookie
            danish.
          </p>
          <span className="testimonial-block-name">
            Indiana Jones, Archaeologist
          </span>
        </div>
        <a className="testimonial-block-link">Tell Me More</a>
      </div>
    </div>
  )
}

const ExerciseTwo = () => {
  return (
    <div>
      <Header headerText="Exercise 2 - Filterable Content" />

      <div>[Exercise 2 Here]</div>
    </div>
  )
}

const App = () => {
  return (
    <>
      <ExerciseOne />
      <ExerciseTwo />
    </>
  )
}

export default App

const ROOT_ELEMENT = document.getElementById("root")
ReactDOM.render(<App />, ROOT_ELEMENT)

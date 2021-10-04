import {Redirect, Route} from 'react-router-dom'

const Guard =({component: Component, ...rest})=>{
  const token = localStorage.getItem("token")
  return(
    <Route {...rest} render={
      (props)=>{
        if (token){
          return <Component {...props}/>
        }else{
          alert('harap login terlebih dahulu')
          return <Redirect to= "/"/>
        }
      }
    }/>
  )
}

export default Guard
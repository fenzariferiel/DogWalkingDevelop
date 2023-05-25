import { useEffect }from 'react'
import { useListingsContext } from "../hooks/useListingsContext"
import { useAuthContext } from '../hooks/useAuthContext'



const Home = () => {
  const {listings, dispatch} = useListingsContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('/api/listings', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      

      if (response.ok) {

        dispatch({type: 'SET_LISTING', payload: json})
      }
    }

    if (user){
      fetchListings()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <div className="workouts">
        {listings && listings.map((item) => (
          <h4>{item.walker_name}</h4>
        ))}
      </div>
    </div>
  )
}

export default Home
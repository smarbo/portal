import React from 'react'
import { AiOutlineLoading, AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function Loading() {
  return (
    <div className="bg-[linear-gradient(orange,purple)] absolute z-[99999] w-full h-full text-white flex justify-center items-center text-center">
      <div className="w-[80%] h-[80%] flex flex-col justify-center items-center">
        <h1>Launching PortalOS...</h1>
        <div className="spinners">
          <div className="spinner-container">
            <AiOutlineLoading3Quarters className='spinny small' size="40px"/>
          </div>
          <div className="spinner-container">
            <AiOutlineLoading className='spinny medium' size="60px"/>
          </div>
          <div className="spinner-container">
            <AiOutlineLoading className='spinny large' size="80px"/>
          </div>
        </div>
      </div>
    </div>
  )
}

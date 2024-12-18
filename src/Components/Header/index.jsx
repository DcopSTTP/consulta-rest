import React from 'react'
import LogoNEAT from '/img/Logo-NEAT-Preta.svg';

export default function Header() {

  return (
    <header className='d-flex justify-content-between px-5 py-4 shadow'>
      <img
          style={{ cursor: 'pointer', padding: 5 }}
          onClick={() => navigate('/')}
          src={LogoNEAT}
          alt="logo-neat"
        />
    </header>
  )
}
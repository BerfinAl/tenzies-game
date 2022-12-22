import React from 'react'

export default function Die({value, isHeld, holdDice}) {
  return (
    <div className={(isHeld ? 'is-held ' : ' ' ) + 'die-box'} onClick={holdDice}>
<h2> {value}</h2>
</div>
  )
}

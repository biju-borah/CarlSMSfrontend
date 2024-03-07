import React from 'react'
import { TailSpin } from 'react-loader-spinner'

function Loader() {
    return (
        <TailSpin   // Type of spinner
            height="80"
            width="80"
            color="#F8492D"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            wrapperClass=""
            visible={true}
        />
    )
}

export default Loader
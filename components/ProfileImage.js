import React from 'react'
import Image from 'next/image'
import { Avatar } from './ui/avatar'

const ProfileImage = ({customClass, src}) => {
    return (
        <Avatar className={customClass}>
            <Image layout="fill" src={src} alt=''/>
        </Avatar>
    )
}

export default ProfileImage

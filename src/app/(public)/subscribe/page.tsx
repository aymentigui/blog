"use client"
import React, { useEffect } from 'react'
import Loading from '@/components/myui/loading'
import { subscribe } from '@/actions/blog/subscribe';
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {

    const searchParams = useSearchParams();
    const email = searchParams.get("email")
    const router = useRouter()

    useEffect(() => {
        if (!email){
            router.push("/")
            return
        }
        subscribe(email).then(res => {
            router.push("/")
        }).catch(err => {
            router.push("/")
        }).finally(() => {
            router.push("/")
        })
    }, []);

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <Loading classSizeProps='h-20 w-20'></Loading>
        </div>
    )
}

export default Page

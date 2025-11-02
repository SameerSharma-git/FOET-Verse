import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className='w-full h-[65vh] md:h-[80vh] flex items-center justify-center gap-6 flex-col'>
            <div className='w-full h-1/2 bg-no-repeat bg-center mx-auto bg-[url("/images/not_found_dog-98fd5bff8642dd0089c45b3a82fe5d56.svg")]'>
                {/* <Image 
                fill
                sizes="100%"
                alt=''
                className="object-cover object-center"
                src={'/images/not_found_dog-98fd5bff8642dd0089c45b3a82fe5d56.svg'} /> */}
            </div>
            <div className='flex items-center justify-center gap-3.5 flex-col'>
                <h1 className='text-lg'>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <Link href="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        </div>
    );
}
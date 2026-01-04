import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <div className='w-full h-[65vh] md:h-[88vh] flex items-center justify-center gap-6 flex-col'>
            <div className='w-full h-1/2 bg-no-repeat bg-center mx-auto bg-[url("/images/not_found_dog-98fd5bff8642dd0089c45b3a82fe5d56.svg")]'>
            </div>
            <div className='flex items-center justify-center gap-3.5 flex-col'>
                <h1 className='text-lg'>404 - Page Not Found</h1>
                <p>The page you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/">
                    <Button>Go To Home <ArrowRight className="scale-x-150 mr-1" /></Button>
                </Link>
            </div>
        </div>
    );
}

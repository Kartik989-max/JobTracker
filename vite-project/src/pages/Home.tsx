import React from 'react'
// import { LampDemo } from '@/components/ui/lamp'
import Navbar from '@/components/ui/Navbar'
import { BackgroundBeams } from '@/components/ui/background-beam'
import { TypewriterEffect } from '@/components/ui/Typewriter-effect'
import { StickyScrollRevealDemo } from '@/components/ui/stickyScroll'
import { Features } from '@/components/Features/Features'
import { HoverEffect } from '@/components/ui/card-hover'
import { Spotlight } from '@/components/ui/Spotlight'
import { WobbleCard } from '@/components/ui/wobble-card'
import Footer  from '@/components/Footer/Footer'
import { Badge } from '@/components/ui/badge'
const HomePage:React.FC=()=> {
  const projects = [
    {
      title: "Dashboard",
      description:
        "📊 View all applied jobs in one place with statuses and deadlines.",
    },
    {
      title: "Chrome Extension",
      description:
        "🖥️ One-click job tracking directly from any job portal using the browser extension.",
    },
    {
      title: "Resume-Analyzer",
      description:
        "📄 Upload your resume and job description to get an ATS-friendly match score.",
      
    },
    {
      title: "Notification",
      description:
        "🔔 Get reminders for follow-ups, interview dates, and application statuses.",
    },
    {
      title: "Auto-Track",
      description:
        "📌 Automatically saves job applications when you apply on LinkedIn, Indeed, and Internshala.",
    },
    {
      title: "Smart-Recommend",
      description:
        "🎯 Get AI-powered job recommendations based on your skills and preferences.",
    },
  ];
  const words = [
    {
      text: "Automate",
    },
    {
      text: "Track",
    },
    {
      text: "Get",
    },
   
    {
      text: "Hired.",
      className: "text-[#779ECB] dark:text-[#779ECB]",
    },
  ];

  return (
    <div>
       <Navbar/>
      {/* <LampDemo/> */}
      <BackgroundBeams/>


      <div>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="flex flex-col items-center justify-center h-[30rem] ">
      {/* <p className="text-neutral-600 dark:text-neutral-200 text-base t mb-10"> */}
      <Badge className='py-1  text-sm  sm:text-xs md:text-xs lg:text-base border-6 rounded-xl mb-6'  variant={'secondary'}>Seamlessly track job applications and get AI-powered recommendations all in one place.</Badge>
      
      {/* </p> */}
      <TypewriterEffect words={words} />
      <ul className='text-white pt-6 px-3 opacity-50 text-center'>
        <li>📊 Stay Organized & Informed – Track your applications and improve your chances of getting hired.</li>
        <li>🔍 Get Smart Recommendations – Discover job opportunities tailored to your preferences.</li>
        <li>✅ Automate Job Tracking – Save applied jobs instantly with our Chrome extension.</li>
      </ul>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-base   ">
         Login
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-base">
          Sign Up
        </button>
      </div>
     
    </div>

      </div>


  

<div className='text-primary px-10 flex flex-col justify-center  text-white
p-4'>
<h1 className='text-center'>Our Features</h1>
{/* <div className='w-full flex align-middle justify-center'>
      <Features/>
</div> */}

    <HoverEffect items={projects}/>
    </div>

{/* WobbleCard */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
<WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className="">
     <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Gippity AI powers the entire universe
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p>
        </div>
        <img
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
  </WobbleCard>
  <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          No shirt, no shoes, no weapons.
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          If someone yells “stop!”, goes limp, or taps out, the fight is over.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Signup for blazing-fast cutting-edge state of the art Gippity AI
            wrapper today!
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            With over 100,000 mothly active bot users, Gippity AI is the most
            popular AI platform for developers.
          </p>
        </div>
        <img
          src="/linear.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>

</div>

<Footer/>
</div>

  ) 
}

export default HomePage
import React from 'react';
import NewRegistration from './NewRegistrationForm';
import background_img from "../assets/form_background.jpg"


const FormWrapper = () => {
  const bgImage = {
    background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(${background_img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    
  }
  return (
    <div className="container mx-auto py-8 px-4" >
      {/* Grid container with responsive columns */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        {/* Left content section */}

        <div className="flex justify-center items-center ">
          <NewRegistration />
        </div>


        {/* Right form section */}
        <div className="hidden md:flex flex-col px-[25px] justify-center items-center gap-2  h-[400px] lg:h-auto" style={bgImage}>
          {/* <img
            src="/favicon.ico"
            alt="Register Karo"
            width={72}
            height={72}
          />
          <div className="text-[#1B3654] text-4xl font-bold">
            Register<span className="text-[#FF8A00]">Karo</span>
          </div>
          <h2 className="text-2xl md:text-xl sm:text-[1.4rem] text-center font-semibold italic mb-4 text-white">"Great opportunities don't come by chance — they start with a single step. Let us help you take it."</h2> */}
          {/* <p className="text-md md:text-sm md:mx-3 text-white text-center mx-auto">
          Great opportunities don't come by chance — they start with a single step. Let us help you take it.
          </p> */}

          {/* Steps to Fill the Form */}
          {/* <div className="mt-3 text-white flex flex-col items-center " >
            <h3 className="text-xl font-extrabold mb-4">Steps to Fill the Form</h3>
            <ul className="list-none space-y-4 text-left flex flex-col items-center">
              <li className="flex items-start justify-start">
                <CheckCircle className="text-blue mr-2 mt-1" />
                <span> Fill in your personal and contact details</span>
              </li>
              <li className="flex items-start justify-start">
                <CheckCircle className="text-blue mr-2 mt-1" />
                <span> Select the service you’re looking for</span>
              </li>
              <li className="flex items-start justify-start">
                <CheckCircle className="text-blue mr-2 mt-1" />
                <span> Double-check your information for accuracy</span>
              </li> 
              <li className="flex items-start justify-start">
                <CheckCircle className="text-blue mr-2 mt-1" />
                <span > Submit the form to get your quotation instantly</span>
              </li>
              
            </ul>
          </div> */}
        </div>


      </div>
    </div>
  );
};

export default FormWrapper;
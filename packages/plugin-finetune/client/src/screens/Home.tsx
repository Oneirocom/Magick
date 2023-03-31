// DOCUMENTED 
/**
 * The HomePage component displays the home page of the application.
 * 
 * If the user is signed in, they are automatically redirected to the /fineTuneManager/completions route.
 * Otherwise, they are prompted to sign in using the SigninForm component.
 * 
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SigninForm from '../account/SignInForm';
import useAuthentication from '../account/useAuthentication';

export default function HomePage() {
  const { isSignedIn } = useAuthentication();
  const navigate = useNavigate();

  /**
   * Redirect user to the /fineTuneManager/completions route if they are signed in.
   * 
   * @param {boolean} isSignedIn - Indicates whether the user is signed in or not.
   */
  useEffect(() => {
    if (isSignedIn) {
      navigate('/fineTuneManager/completions');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="mx-auto max-w-6xl">
      <Header />
      <div className="flex flex-col lg:flex-row gap-x-20 gap-y-8 my-10">
        <div className="lg:my-20 lg:w-1/3 shrink-0">
          <SigninForm />
        </div>
      </div>
    </div>
  );
}

/**
 * The Header component displays the header of the home page.
 * 
 */
function Header() {
  return (
    <header className="my-4">
      <h1 className="flex flex-wrap gap-4 text-4xl lg:text-5xl">
        <span className="flex flex-nowrap gap-4 font-bold"></span>
      </h1>
    </header>
  );
}
import React, { useRef, useState, useEffect } from 'react';
import { submitComment } from '../services';

const CommentsForm = ({ slug }) => {
  const [error, setError] = useState(null);
  const [localStorage, setLocalStorage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const commentEl = useRef();
  const nameEl = useRef();
  const emailEl = useRef();
  const storeDataEl = useRef();

  useEffect(() => {
    nameEl.current.value = window.localStorage.getItem('name');
    emailEl.current.value = window.localStorage.getItem('email');
  }, []);

  const handleCommentSubmission = () => {
    setError(false);
    const { value: comment } = commentEl.current;
    const { value: name } = nameEl.current;
    const { value: email } = emailEl.current;
    const { checked: storeData } = storeDataEl.current;
  
    // E-Mail-Validierung
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  // Überprüfen, ob alle Felder ausgefüllt sind und die E-Mail gültig ist
  if (!name || !email || !comment || !isValidEmail) {
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
    } else {
      setError("All fields are required.");
    }
    return;
  }
  
    const commentObj = { name, email, comment, slug };
  
    if (typeof window !== 'undefined') {
      if (storeData) {
        window.localStorage.setItem('name', name);
        window.localStorage.setItem('email', email);
      } else {
        window.localStorage.removeItem('name');
        window.localStorage.removeItem('email');
      }
    }
  
    submitComment(commentObj)
      .then((res) => {
        if (res.createComment) {
          if (!storeData) {
            nameEl.current.value = '';
            emailEl.current.value = '';
          }
          commentEl.current.value = '';
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error('Error submitting comment:', err);
        setError(true);
      });
  };
    
  return (
    <div className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8'>
      <h3 className='text-xl mb-8 font-semibold border-b pb-4'>Leave a Reply</h3>
      <div className='grid grid-cols-1 gap-4 mb-4'>
        <textarea 
          ref={commentEl} 
          className='p-4 border rounded-lg outline-none w-full focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700' 
          placeholder='Comment'
          name='comment'
        />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
        <input
            type='text' ref={nameEl}
            className='py-2 border rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700'
            placeholder='Name'
            name='name'
        />
        <input
            type='text' ref={emailEl}
            className='py-2 border rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700'
            placeholder='Email'
            name='email'
        />
      </div>
      <div className='grid grid-cols-1 gap-4 mb-4'>
        <div>
          <input ref={storeDataEl} type='checkbox' id='storeData' name='storeData' />
          <label className='text-gray-500 cursor-pointer ml-2' htmlFor='storeData'>Save my e-mail and name for the next time i comment.</label>
        </div>
      </div>
      {error && <p className='text-xs text-red-500'>{error}</p> }
      <div className='mt-8'>
        <button 
          type="button" 
          onClick={handleCommentSubmission} 
          className='transition duration-500 ease hover:bg-indings-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer'
          >
        Post Comment
        </button>
        {showSuccessMessage && <span className='text-xl float-right font-semibold mt-3 text-green-500'>Comment submitted for review</span>}
      </div>
    </div>
  )
}
  
export default CommentsForm;



  

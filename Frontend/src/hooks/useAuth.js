/*
------------------------------------------------
File: useAuth.js
Purpose: Custom React hook to consume AuthContext.
Responsibilities: Exposes user state, login and logout helpers.
Dependencies: AuthContext
------------------------------------------------
*/

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/*
Exposes Auth Context variables.
Returns: useContext(AuthContext) object wrapper.
*/
export const useAuth = () => {
  return useContext(AuthContext);
};

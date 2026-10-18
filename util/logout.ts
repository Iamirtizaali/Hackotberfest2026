const logout = async (): Promise<void> => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({})
  });

  const responseInJson = await response.json();

  if (responseInJson.message === 'success') {
    window.location.href = `${window.location.origin}/login`;
  }
};

export default logout;

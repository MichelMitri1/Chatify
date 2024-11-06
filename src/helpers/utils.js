export const randomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const loginUser = async (email, pass) => {
  try {
    const userApi = "http://localhost:3000/api/users/loginUser";

    const userResponse = await fetch(userApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        pass: pass,
      }),
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      throw new Error(
        `HTTP error! status: ${userResponse.status}, message: ${errorText}`
      );
    }

    const result = await userResponse.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours % 12 || 12;
  const formattedMinutes = String(minutes).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

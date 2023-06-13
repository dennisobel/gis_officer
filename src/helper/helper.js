import axios from "axios";
import jwt_decode from "jwt-decode";

// const location = useSelector(state => state.location)

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

/** Make API Requests */

/** To get email from Token */
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find Token");
  let decode = jwt_decode(token);
  return decode;
}

/** authenticate function */
export async function authenticate(email) {
  try {
    return await axios.post("/auth/authenticate", { email });
  } catch (error) {
    return { error: "Username doesn't exist...!" };
  }
}

/** get User details */
export async function getUser({ email }) {
  try {
    const { data } = await axios.get(`/auth/user/${email}`);
    return { data };
  } catch (error) {
    return { error: "Password doesn't Match...!" };
  }
}

/** get Users */
export async function getUsers() {
  try {
    const data = await axios.get("/auth/users");
    return data;
  } catch (error) {
    return { error: "Users not found" };
  }
}

/**get officers */
export async function getOfficers({ county, role }) {
  try {
    const data = await axios.get(`/auth/officers/${county}/${role}`);
    return data;
  } catch (error) {
    return { error: "Users not found" };
  }
}

/** register user function */

export async function registerUser(credentials, location) {
  try {
    const headers = {
      "X-Coordinates": `${location.latitude},${location.longitude}`,
    };
    const {
      data: { msg },
      status,
    } = await axios.post(`/auth/register`, credentials, { headers });

    let { email } = credentials;

    /** send email */
    if (status === 201) {
      await axios.post("/auth/registerMail", { userEmail: email, text: msg });
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** login function */
export async function verifyPassword({ email, password }) {
  try {
    if (email) {
      const { data } = await axios.post("/auth/login", { email, password });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
}

/** update user profile function */
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put("/auth/updateuser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}

/** generate OTP */
export async function generateOTP(msisdn) {
  try {
    const {
      data: { code },
      status,
    } = await axios.post("/auth/generateOTP", { msisdn });

    // send mail with the OTP
    if (status === 201) {
      let {
        data: { msisdn },
      } = await getUser({ msisdn });
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post("/auth/registerMail", {
        userEmail: msisdn,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject(`Bug: ${error}`);
  }
}

/** verify OTP */
export async function verifyOTP({ msisdn, code }) {
  try {
    const { data, status } = await axios.get("/auth/verifyOTP", {
      params: { msisdn, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}

/** reset password */
export async function resetPassword({ email, password }) {
  try {
    const { data, status } = await axios.put("/auth/resetPassword", {
      email,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** create building */
export async function createBuilding(body) {
  try {
    const data = await axios.post(`/buildings/create`, body);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** get building */
export async function getBuildingById({ _id }) {
  try {
    const token = await localStorage.getItem("token");
    const { data } = await axios.get(`/buildings/${_id}`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data };
  } catch (error) {
    return { error };
  }
}

/** get buildings */
export async function getAllCountyBuildings(county) {
  try {
    const data = await axios.get(`/buildings/buildings/${county}`);
    return data;
  } catch (error) {
    return { error: "Buildings not found" };
  }
}

/** update building function */
export async function updateBuilding(building) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put("/building/update", building, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Building...!" });
  }
}

/** get business */
export async function getBusinessById(id) {
  const token = await localStorage.getItem("token");
  try {
    const { data } = await axios.get(`/business/business/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data };
  } catch (error) {
    return { error };
  }
}

/** get county business */
export async function getCountyBusiness({
  page,
  pageSize,
  sort,
  search,
  county,
}) {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get(`/business/businesses/${county}`, {
      params: { page, pageSize, sort, search },
      headers
    });
    return { data };
  } catch (error) {
    return { error };
  }
}

/** get ward business */
export async function getWardBusinesses({ ward }) {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get(`/buildings/ward/${ward}`,{headers});
    return { data };
  } catch (error) {
    return { error };
  }
}

/** get businesses */
export async function getAllBusinesses() {
  try {
    const data = await axios.get("/business/businesses");
    return data;
  } catch (error) {
    return { error: "Buildings not found" };
  }
}

/** update business function */
export async function updateBusiness(_id) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put("/business/update", _id, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Building...!" });
  }
}
/**Get county */
export async function getCounty(code) {
  try {
    const county = await axios.get(`/county/counties/${code}`);
    return county;
  } catch (error) {
    return { error: "County not found" };
  }
}

/** get building */
export async function getAllBuildingStores({ _id }) {
  try {
    const token = await localStorage.getItem("token");
    const headers = {
      "Authorization": `Bearer ${token}`
    };
    const { data } = await axios.get(`/buildings/${_id}`,{headers});
    return { data };
  } catch (error) {
    return { error };
  }
}

/** get businesses by building id */
export async function getBuildingStores(id) {
  try {
    const data = await axios.get(`/business/businesses/${id}`);
    return data;
  } catch (error) {
    return { error: "Stores not found" };
  }
}

/**Send Message */
export async function sendMail({ to, from, name, email_body }) {
  try {
    const res = await axios.post(`/user/send-mail/`, {
      to,
      from,
      name,
      email_body,
    });
    return res;
  } catch (error) {
    return { error: "message not sent" };
  }
}

export async function createBusinessPermit(data, location) {
  const token = await localStorage.getItem("token");
  try {
    const headers = {
      "X-Coordinates": `${location.latitude},${location.longitude}`,
      "Authorization": `Bearer ${token}`
    };
    const res = await axios.post("/business/register", data, {
      headers,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** create business */
export async function createBusiness(body, location) {
  const token = await localStorage.getItem("token");
  try {
    const headers = {
      "X-Coordinates": `${location.latitude},${location.longitude}`,
      "Authorization": `Bearer ${token}`
    };
    const res = await axios.post("/business/register", body, {
      headers,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**STK Push */
export async function initiateSTK(data, location) {
  const token = await localStorage.getItem("token");
  try {
    const headers = {
      "X-Coordinates": `${location.latitude},${location.longitude}`,
      "Authorization": `Bearer ${token}`
    };
    const res = await axios.post("/general/stk", data, {
      headers,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**VERIFY TRANSACTION */
export async function verifyTransaction(data,location){
  try {
    const token = await localStorage.getItem("token");
    const headers = {
      "X-Coordinates": `${location.latitude},${location.longitude}`,
      "Authorization": `Bearer ${token}`
    };
    const res = await axios.post("/transactions/verify", data, {
      headers,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({ error });
  }
}


/**VERIFY BUSINESS */
export async function verifyBusiness(data,location){
  try {
    const token = await localStorage.getItem("token");
    const headers = {
      "X-Coordinates": `${location.latitude},${location.longitude}`,
      "Authorization": `Bearer ${token}`
    };
    const res = await axios.post("/business/verify", data, {
      headers,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**ESCALATE */
export async function escalate(data,location){
  const token = await localStorage.getItem("token");
  try {
    const headers = {
      "X-Coordinates": `${location.latitude},${location.longitude}`,
      "Authorization": `Bearer ${token}`
    };
    const res = await axios.post("/business/escalation", data, {
      headers,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**CALCULATE DISTANCE BETWEEN CURRENT LOCATION AND STORE */
export function calculateDistance(origin, destination) {
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  const earthRadius = 6371; // Radius of the Earth in kilometers

  const { lat: lat1, lng: lng1 } = origin;
  const { lat: lat2, lng: lng2 } = destination;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance * 1000; // Convert distance to meters
}

/**IMAGE UPLOAD */
export async function imageUpload(data,location){
  console.log("inside image upload",data,location)
  const token = await localStorage.getItem("token");
  try {
    const headers = {
      "X-Coordinates": `${location.latitude},${location.longitude}`,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    };
    const res = await axios.post("/business/upload", data, {
      headers,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject({ error });
  }
}
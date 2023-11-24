import {db} from './firebase-db';
   
import { collection, addDoc, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const addData = async (collectionName , data) => {
   
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            data
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

const setData = async (collectionName, data, id) => {
   
    try {
        await setDoc(doc(db, collectionName, id), {
            data
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}


const updateData = async (collectionName, data, id) => {
   
    try {
        await updateDoc(doc(db, collectionName, id), {
            data
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

const getDataById = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return (docSnap.data());
    } else {
        return undefined;
    }
}

const fetchData = async (collectionName) => {
   
    const querySnapshot = await getDocs(collection(db, collectionName));
            
    const newData = querySnapshot.docs
        .map((doc) => ({...doc.data(), id:doc.id }));

    // console.log(newData);
    return newData; 
   
}

export const dbCtrl = {
    addData,
    fetchData,
    setData,
    updateData,
    getDataById
}
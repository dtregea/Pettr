import { useState } from 'react'

function useAddPost() {
    const [addedPosts, setAddedPosts] = useState([]);

    const addPost = (newPost) => {
        setAddedPosts(prev => {
            return [newPost, ...prev];
        });
    }

    const removePost = (_id) => {
        setAddedPosts(addedPosts.filter(post => {
            return post._id != _id;
        }));
    }

    const clearPosts = () => {
        setAddedPosts([]);
    }

    return { addedPosts, addPost, removePost, clearPosts };
}

export default useAddPost
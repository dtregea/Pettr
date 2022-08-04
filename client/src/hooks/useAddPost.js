import { useState } from 'react'

function useAddPost() {
    const [addedPosts, setAddedPosts] = useState([]);

    const addPost = (newPost) => {
        setAddedPosts(prev => {
            return [newPost, ...prev];
        });
    }

    const removeAddedPost = (_id) => {
        if (addedPosts) {
            setAddedPosts(addedPosts.filter(post => {
                return post._id != _id;
            }));
        }

    }

    const clearPosts = () => {
        setAddedPosts([]);
    }

    return { addedPosts, addPost, removeAddedPost, clearPosts };
}

export default useAddPost
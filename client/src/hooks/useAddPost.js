import { useState } from 'react'

// This hook contains variables and functions to be put into and manage a Feed component
// This hook manages posts that were posted from the user that should show on the feed
// but were not retrieved by pagination
function useAddPost() {
    const [addedPosts, setAddedPosts] = useState([]);

    // Add a post to a feed
    const addPost = (newPost) => {
        setAddedPosts(prev => {
            return [newPost, ...prev];
        });
    }

    // Remove an added post from a feed
    const removeAddedPost = (_id) => {
        if (addedPosts) {
            setAddedPosts(addedPosts.filter(post => {
                return post._id !== _id;
            }));
        }
    }

    const clearPosts = () => {
        setAddedPosts([]);
    }

    return { addedPosts, addPost, removeAddedPost, clearPosts };
}

export default useAddPost
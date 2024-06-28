import Post from "./post.jsx";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";


const Posts = ({ feedType, username, userId }) => {
	const [posts, setPosts] = useState([])
	const getPostEndpoint = () => {
		switch (feedType) {
			case "Problems":
				return "/api/posts/category/Problems";
			case "Announcements":
				return "/api/posts/category/Announcements";
			case "Celebrations":
				return "/api/posts/category/Celebrations";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				setPosts(data)
				return data;
			} catch (error) {
				throw new Error(error);
			}
		}
	});

	async function getData() {
		try {
			const res = await fetch(POST_ENDPOINT);
			setPosts(await res.json())

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}

		} catch (error) {
			throw new Error(error);
		}
	}

	useEffect(() => {
		console.log("here", posts)
	}, [posts])

	useEffect(() => {
		refetch();
		// getData()
	}, [feedType, refetch, username]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;
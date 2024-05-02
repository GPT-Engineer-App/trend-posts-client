import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, Button, Text, Link, Divider, useToast } from "@chakra-ui/react";
import { FaSync } from "react-icons/fa";

const Header = ({ onRefresh }) => {
  return (
    <Box bg="teal.500" w="100%" p={4} color="white">
      <Heading size="lg">
        SpecNews
        <Button onClick={onRefresh} size="sm" ml={4} colorScheme="teal" variant="outline">
          <FaSync />
        </Button>
      </Heading>
    </Box>
  );
};

const PostItem = ({ post }) => {
  return (
    <Box p={4}>
      <Link href={post.url} isExternal color="teal.500" fontWeight="bold">
        {post.title}
      </Link>
      <Text mt={2}>
        Score: {post.score} - Author: {post.by}
      </Text>
      <Divider my={4} />
    </Box>
  );
};

const PostList = ({ posts }) => {
  return (
    <VStack spacing={4} align="stretch">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </VStack>
  );
};

const Index = () => {
  const [posts, setPosts] = useState([]);
  const toast = useToast();

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const data = await response.json();
      const postsData = await Promise.all(
        data.slice(0, 10).map(async (id) => {
          const postResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return postResponse.json();
        }),
      );
      setPosts(postsData);
    } catch (error) {
      toast({
        title: "Error fetching posts",
        description: "Unable to fetch posts from HackerNews.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box>
      <Header onRefresh={fetchPosts} />
      <Box mt={8}>
        <PostList posts={posts} />
      </Box>
    </Box>
  );
};

export default Index;

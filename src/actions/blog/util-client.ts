"use client"

import { getBlogsCategoriesPublic } from "./categories/get";
import { getBlogsDesc, getBlogsDescFavorites } from "./get";



export const fetchBlogs = async (setBlogs:any,setIsLoading:any, page=1, pageSize=3 , setCount:any, debouncedSearchQuery="", serachCategories:string[]=[], sortedBy="") => {
  setBlogs([]);
  setIsLoading(false);
  try {
    setIsLoading(true);
    const res = await getBlogsDesc(page, pageSize,debouncedSearchQuery, undefined, serachCategories, sortedBy)

    if (res.status === 200 && res.data) {
      setBlogs(res.data);
      if(setCount) setCount(res.count)
    }

  } catch (error) {
    console.error("Error fetching articles:", error);
    setBlogs([]);
    if(setCount) setCount(0)
  } finally {
    setIsLoading(false);
  }
};

export const fetchBlogsFavoris = async (setBlogs:any,setIsLoading:any, page=1, pageSize=3 , setCount:any, debouncedSearchQuery="", serachCategories:string[]=[], sortedBy="") => {
  setBlogs([]);
  setIsLoading(false);
  try {
    setIsLoading(true);
    const res = await getBlogsDescFavorites(page, pageSize,debouncedSearchQuery, undefined, serachCategories, sortedBy)

    if (res.status === 200 && res.data) {
      setBlogs(res.data);
      if(setCount) setCount(res.count)
    }

  } catch (error) {
    console.error("Error fetching articles:", error);
    setBlogs([]);
    if(setCount) setCount(0)
  } finally {
    setIsLoading(false);
  }
};

export const fetchCategories = async (setCategories:any,setIsLoadingC:any)=> {
    setCategories([]);
    setIsLoadingC(false);
    try {
      setIsLoadingC(true);
      const res = await getBlogsCategoriesPublic()
    //   console.log(res)
      if (res.status === 200 && res.data) {
        setCategories(res.data);
      }

    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingC(false);
    }
  };
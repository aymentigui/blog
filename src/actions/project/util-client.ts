"use client"

import { getProjectsCategoriesPublic } from "./categories/get";
import { getProjectsDesc } from "./get";

export const fetchProjects = async (setProjects:any,setIsLoading:any, page=1, pageSize=3 , setCount:any, debouncedSearchQuery="", serachCategories:string[]=[], sortedBy="") => {
  setProjects([]);
  setIsLoading(false);
  try {
    setIsLoading(true);
    const res = await getProjectsDesc(page, pageSize,debouncedSearchQuery, undefined, serachCategories, sortedBy)

    if (res.status === 200 && res.data) {
      setProjects(res.data);
      if(setCount) setCount(res.count)
    }

  } catch (error) {
    console.error("Error fetching articles:", error);
    setProjects([]);
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
      const res = await getProjectsCategoriesPublic()
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
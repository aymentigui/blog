"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, ChevronDown, Newspaper, FolderKanban, MessageSquare, Tag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';

export default function Dashboard() {

    const translate = useTranslations("Dashboard")

    // State for API data
    const [stats, setStats] = useState({
        blogCount: 0,
        projectCount: 0,
        commentCount: 0,
        blogCategoriesCount: 0,
        projectCategoriesCount: 0,
    });

    const [pageViews, setPageViews] = useState([]);
    const [blogViews, setBlogViews] = useState([]);
    const [projectViews, setProjectViews] = useState([]);

    // State for time filters
    const [pageViewTimeFilter, setPageViewTimeFilter] = useState('all');
    const [blogViewTimeFilter, setBlogViewTimeFilter] = useState('all');
    const [projectViewTimeFilter, setProjectViewTimeFilter] = useState('all');

    // Fetch data on component mount
    useEffect(() => {
        // Fetch global statistics
        fetchGlobalStats();

        // Fetch views data with initial filters
        fetchPageViews(pageViewTimeFilter);
        fetchBlogViews(blogViewTimeFilter);
        fetchProjectViews(projectViewTimeFilter);
    }, []);

    // Effect to reload data when filters change
    useEffect(() => {
        fetchPageViews(pageViewTimeFilter);
    }, [pageViewTimeFilter]);

    useEffect(() => {
        fetchBlogViews(blogViewTimeFilter);
    }, [blogViewTimeFilter]);

    useEffect(() => {
        fetchProjectViews(projectViewTimeFilter);
    }, [projectViewTimeFilter]);

    // API call functions
    const fetchGlobalStats = async () => {
        try {
            const response = await fetch('/api/dashboard/global-stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching global stats:', error);
        }
    };

    const fetchPageViews = async (timeFilter: any) => {
        try {
            const response = await fetch(`/api/dashboard/page-views?timeFilter=${timeFilter}`);
            const data = await response.json();
            setPageViews(data);
        } catch (error) {
            console.error('Error fetching page views:', error);
        }
    };

    const fetchBlogViews = async (timeFilter: any) => {
        try {
            const response = await fetch(`/api/dashboard/blog-views?timeFilter=${timeFilter}`);
            const data = await response.json();
            setBlogViews(data);
        } catch (error) {
            console.error('Error fetching blog views:', error);
        }
    };

    const fetchProjectViews = async (timeFilter: any) => {
        try {
            const response = await fetch(`/api/dashboard/project-views?timeFilter=${timeFilter}`);
            const data = await response.json();
            setProjectViews(data);
        } catch (error) {
            console.error('Error fetching project views:', error);
        }
    };

    // Handle filter changes
    const handlePageViewFilterChange = (value: any) => {
        setPageViewTimeFilter(value);
    };

    const handleBlogViewFilterChange = (value: any) => {
        setBlogViewTimeFilter(value);
    };

    const handleProjectViewFilterChange = (value: any) => {
        setProjectViewTimeFilter(value);
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{translate("title")}</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{translate("blogs")}</CardTitle>
                        <Newspaper className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.blogCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{translate("projects")}</CardTitle>
                        <FolderKanban className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.projectCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{translate("comments")}</CardTitle>
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.commentCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{translate("blogscategories")}</CardTitle>
                        <Tag className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.blogCategoriesCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{translate("projectscategories")}</CardTitle>
                        <Tag className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.projectCategoriesCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Page Views Chart */}
            <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>{translate("pagesviews")}</CardTitle>
                    <Select value={pageViewTimeFilter} onValueChange={handlePageViewFilterChange}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{translate("alltime")}</SelectItem>
                            <SelectItem value="year">{translate("lastyear")}</SelectItem>
                            <SelectItem value="month">{translate("lastmonth")}</SelectItem>
                            <SelectItem value="week">{translate("lastweak")}</SelectItem>
                            <SelectItem value="today">{translate("today")}</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={pageViews}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="page" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Blog & Project Views Tabs */}
            <Tabs defaultValue="blogs" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="blogs">{translate("blogsviews")}</TabsTrigger>
                    <TabsTrigger value="projects">{translate("projectsview")}</TabsTrigger>
                </TabsList>

                {/* Blog Views Content */}
                <TabsContent value="blogs">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>{translate("blogsviews")}</CardTitle>
                            <Select value={blogViewTimeFilter} onValueChange={handleBlogViewFilterChange}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Select time range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{translate("alltime")}</SelectItem>
                                    <SelectItem value="year">{translate("lastyear")}</SelectItem>
                                    <SelectItem value="month">{translate("lastmonth")}</SelectItem>
                                    <SelectItem value="week">{translate("lastweak")}</SelectItem>
                                    <SelectItem value="today">{translate("today")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={blogViews}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="title" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="views" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Project Views Content */}
                <TabsContent value="projects">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>{translate("projectsview")}</CardTitle>
                            <Select value={projectViewTimeFilter} onValueChange={handleProjectViewFilterChange}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Select time range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{translate("alltime")}</SelectItem>
                                    <SelectItem value="year">{translate("lastyear")}</SelectItem>
                                    <SelectItem value="month">{translate("lastmonth")}</SelectItem>
                                    <SelectItem value="week">{translate("lastweak")}</SelectItem>
                                    <SelectItem value="today">{translate("today")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={projectViews}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="title" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="views" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
import axios from "axios";
import React, { Component } from "react";
import CategoriesService from "../../Services/CategoriesService";
import { Link } from "react-router-dom";
import { Can } from "../../Abilities/Can";

class FeedbacksIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            feedbacks: [],
            categories: [],
            query: {
                page: 1,
                id: '',
                user_id: 2,
                category_id: " ",
                message: '',
                theme: '',
                order_column: "id",
                order_direction: "desc",
            },
        };

        this.categoryChanged = this.categoryChanged.bind(this);
        this.pageChanged = this.pageChanged.bind(this);
        this.orderChanged = this.orderChanged.bind(this);
    }

    fetchFeedbacks() {
        axios
            .get("/api/feedbacks", { params: this.state.query })
            .then((response) => this.setState({ feedbacks: response.data }));
    }

    renderCategoryFilter() {
        const categories = this.state.categories.map((category) => (
            <option key={category.id} value={category.id}>
                {category.category}
            </option>
        ));

        return (
            <select
                className="border-2  border-gray-300 rounded-md  text-sm  hover:border-blue-500 focus:outline-none focus:border-blue-500"
                onChange={this.categoryChanged}
            >
                <option>Категории</option>
                {categories}
            </select>
        );
    }

    componentDidMount() {
        CategoriesService.getAll().then((response) =>
            this.setState({ categories: response.data.data })
        );
        this.fetchFeedbacks();
    }

    pageChanged(url) {
        const fullUrl = new URL(url);
        this.setState(
            {
                query: {
                    page: fullUrl.searchParams.get("page"),
                },
            },
            () => this.fetchFeedbacks()
        );
        this.state.query.page = fullUrl.searchParams.get("page");

        this.fetchFeedbacks();
    }

    categoryChanged(event) {
        const selectedCategory = event.target.value;

    if (selectedCategory === "Категории") {
        
        this.setState(
            {
                query: {
                    category_id: "", 
                    page: 1,
                },
            },
            () => this.fetchFeedbacks()
        );
    } else {
        
        this.setState(
            {
                query: {
                    category_id: selectedCategory,
                    page: 1,
                },
            },
            () => this.fetchFeedbacks()
        );
    }
    }

    renderPaginationLinks() {
        return this.state.feedbacks.meta.links.map((link, index) => (
            <button
                key={index}
                onClick={() => this.pageChanged(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
                className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 first:rounded-l-md last:rounded-r-md"
            />
        ));
    }

    renderPagination() {
        return (
            <nav
                role="navigation"
                aria-label="Pagination Navigation"
                className="flex items-center justify-between"
            >
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 leading-5">
                            c
                            <span>
                                <span className="font-medium">
                                    {" "}
                                    {this.state.feedbacks.meta.from}{" "}
                                </span>
                                по
                                <span className="font-medium">
                                    {" "}
                                    {this.state.feedbacks.meta.to}{" "}
                                </span>
                            </span>
                            из
                            <span className="font-medium">
                                {" "}
                                {this.state.feedbacks.meta.total}{" "}
                            </span>
                            заявок
                        </p>
                    </div>

                    <div>
                        <span className="relative z-0 inline-flex shadow-sm rounded-md">
                            {this.renderPaginationLinks()}
                        </span>
                    </div>
                </div>
            </nav>
        );
    }

    

    renderFeedbacks() {

        
        return this.state.feedbacks.data.map((feedback) => (

            
            
            <tr  key={feedback.id} className=" hover:bg-gray-50">
                
                <td className="px-4 py-4">
                    <div className="font-medium text-gray-700">
                        {feedback.id}
                    </div>
                </td>

                <td className="px-2 py-4">
                    <div className="flex ">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                            {feedback.category.category}
                        </span>
                    </div>
                </td>
                <td className="px-2 py-4">
                    <div className="text-sm font-normal text-gray-900">
                        <div className="font-medium text-gray-700">
                            {feedback.theme}
                        </div>
                    </div>
                </td>
                <td className="px-2 py-4" style={{ wordWrap: 'break-word', maxWidth: '200px' }}> {feedback.message}</td>
                <td className="px-2 py-4" style={{ wordWrap: 'break-word', maxWidth: '200px' }}> {feedback.answer}</td>

                <td className="px-2 py-4 ">
                    <div className="text-sm font-normal text-gray-900">
                        <div className="font-medium text-gray-700">
                            {feedback.user.name}
                        </div>
                    </div>
                </td>
                <td className="  px-2 py-4 ">
                    <div className="text-sm font-normal text-gray-900">
                        <div className="font-medium text-gray-700">
                            {feedback.user.email}
                        </div>
                    </div>
                </td>
                <td className=" px-2 py-4">
                    
                    {feedback.file && (
                        <a className="flex" href={feedback.file} download> 
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                            />
                        </svg>
                        Файл
                        </a>
                    )}
                        
                    
                </td>
                <td className="  px-2 py-4 ">
                    <div className="text-sm font-normal text-gray-900">
                        <div className="font-medium text-gray-700">
                            {feedback.created_at}
                        </div>
                    </div>
                </td>

                <td className=" px-2 py-4">
                    <Can do="feedback_answer">
                    <Link to={`answer/${feedback.id}`}>
                        <button
                            type="button"
                            className="nline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Ответить
                        </button>
                    </Link>
                    </Can>
                </td>
                
                
            </tr>
            
        ));
    }

    orderColumnIcon(column) {
        let icon = "M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9";
        if (this.state.query.order_column === column) {
            if (this.state.query.order_direction === "asc") {
                icon = "M4.5 15.75l7.5-7.5 7.5 7.5";
            } else {
                icon = "M19.5 8.25l-7.5 7.5-7.5-7.5";
            }
        }
        return (
            <>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={icon}
                    />
                </svg>
            </>
        );
    }

    orderChanged(column) {
        let direction = "asc";
        if (column === this.state.query.order_column) {
            direction =
                this.state.query.order_direction === "asc" ? "desc" : "asc";
        }

        this.setState(
            {
                query: {
                    page: 1,
                    order_column: column,
                    order_direction: direction,
                },
            },
            () => this.fetchFeedbacks()
        );
    }

    render() {
        if (!('data' in this.state.feedbacks)) return;
        return (
            <div>
                <div className="ml-5">{this.renderCategoryFilter()}</div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md m-5">
                    <div className="min-w-screen ">
                        <table className="min-w-max w-full table-auto border-collapse bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="flex items-center px-4 py-4 font-medium text-gray-900"
                                    >
                                        ID
                                        <button
                                            onClick={() =>
                                                this.orderChanged("id")
                                            }
                                            type="button"
                                            className="column-sort"
                                        >
                                            {this.orderColumnIcon("id")}
                                        </button>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-3 font-medium text-gray-900"
                                    >
                                        Категория
                                    </th>
                                    <th
                                        scope="col"
                                        className="flex items-center px-2 py-4 font-medium text-gray-900"
                                    >
                                        Тема
                                        <button
                                            onClick={() =>
                                                this.orderChanged("theme")
                                            }
                                            type="button"
                                            className="column-sort"
                                        >
                                            {this.orderColumnIcon("theme")}
                                        </button>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-4 font-medium text-gray-900"
                                    >
                                        Сообщение
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-4 font-medium text-gray-900"
                                    >
                                        Ответ
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-2 py-4 font-medium text-gray-900"
                                    >
                                        Имя
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-4 font-medium text-gray-900"
                                    >
                                        E-mail
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-4 font-medium text-gray-900"
                                    >
                                        Файл
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-4 font-medium text-gray-900"
                                    >
                                        Создано
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-2 py-4 font-medium text-gray-900"
                                    ></th>
                                    
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                                {this.renderFeedbacks()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>{this.renderPagination()}</div>
            </div>
        );
    }
}

export default FeedbacksIndex;

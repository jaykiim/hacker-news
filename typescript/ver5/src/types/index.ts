// TODO 타입 정의 (타입 앨리어스 방식) ==============================================================

import View from "../core/view";

export type Store = {
  currentPage: number;
  feeds: NewsFeed[];
};

export type News = {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
};

export type NewsFeed = News & {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean;
};

export type NewsDetail = News & {
  readonly comments: NewsComment[];
};

export type NewsComment = News & {
  readonly comments: NewsComment[];
  readonly level: number;
};

export type RouteInfo = {
  path: string;
  page: View;
};

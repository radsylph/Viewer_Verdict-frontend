import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'discover',
        loadChildren: () =>
          import('./discover/discover.module').then(
            (m) => m.DiscoverPageModule
          ),
      },
      {
        path: 'catalogue',
        loadChildren: () =>
          import('./catalogue/catalogue.module').then(
            (m) => m.CataloguePageModule
          ),
      },
      {
        path: 'community',
        loadChildren: () =>
          import('./community/community.module').then(
            (m) => m.CommunityPageModule
          ),
      },
      {
        path: 'scream-movies',
        loadChildren: () =>
          import('./scream-movies/scream-movies.module').then(
            (m) => m.ScreamMoviesPageModule
          ),
      },
    ],
  },
  {
    path: 'scream-series',
    loadChildren: () =>
      import('./scream-series/scream-series.module').then(
        (m) => m.ScreamSeriesPageModule
      ),
  },
  {
    path: 'watchlist',
    loadChildren: () =>
      import('./watchlist/watchlist.module').then((m) => m.WatchlistPageModule),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatPageModule),
  },
  {
    path: 'reviewcoment',
    loadChildren: () =>
      import('./reviewcoment/reviewcoment.module').then(
        (m) => m.ReviewcomentPageModule
      ),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserPageModule),
  },
  {
    path: 'groupchat',
    loadChildren: () =>
      import('./groupchat/groupchat.module').then((m) => m.GroupchatPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}

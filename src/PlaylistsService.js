const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    const QueryPlaylist = {
      text: `SELECT playlists.id as "id", playlists.name as "name"
      FROM playlists_song
      INNER JOIN playlists ON playlists_song.playlist_id = playlists.id 
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const QuerySong = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      INNER JOIN playlists_song ON songs.id = playlists_song.song_id
      WHERE playlists_song.playlist_id = $1`,
      values: [playlistId],
    };

    // eslint-disable-next-line no-underscore-dangle
    const playlistResult = await this._pool.query(QueryPlaylist);
    // eslint-disable-next-line no-underscore-dangle
    const songResult = await this._pool.query(QuerySong);

    return {
      playlist: {
        id: playlistResult.rows[0].id,
        name: playlistResult.rows[0].name,
        songs: songResult.rows,
      },
    };
  }
}

module.exports = PlaylistsService;

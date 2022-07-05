import { shape } from 'prop-types';
import React, { Component } from 'react';
import Header from '../components/header';
import Loading from '../components/Loading';
import MusicCard from '../components/MusicCard';
import { addSong } from '../services/favoriteSongsAPI';
import getMusics from '../services/musicsAPI';

class Album extends Component {
  constructor() {
    super();
    this.state = {
      album: [],
      favorite: false,
      favoriteCheckedSt: {},
      loadingSuccess: false,
    };
  }

  componentDidMount() {
    this.loadMusic();
  }

  handleChange = ({ target: { name, checked } }, music) => {
    /* console.log(music); */
    this.setState(({ favoriteCheckedSt }) => ({
      favorite: true,
      favoriteCheckedSt: { ...favoriteCheckedSt, [name]: checked }, // salva estado anterior
    }), async () => {
      await addSong(music);
      this.setState({ favorite: false });
    });
  };

  loadMusic = async () => {
    const { match: { params: { id } } } = this.props;
    const resutApi = await getMusics(id);
    this.setState({
      album: resutApi,
      favorite: false,
      loadingSuccess: true,
    });
  };

  render() {
    const { album, favorite, favoriteCheckedSt, loadingSuccess } = this.state;
    return (
      <>
        <Header />
        <div data-testid="page-album">

          {loadingSuccess && (
            <section>
              <h2 data-testid="album-name">{album[0].collectionName}</h2>
              <p data-testid="artist-name">{album[0].artistName}</p>
              {favorite ? <Loading /> : (
                <>
                  {album.slice(1).map((song) => (
                    <MusicCard
                      key={ song.trackId }
                      tracks={ song }
                      handleChange={ this.handleChange }
                      favoriteChecked={ favoriteCheckedSt }
                    />
                  ))}
                </>
              )}
            </section>
          )}
        </div>
      </>
    );
  }
}

Album.propTypes = {
  match: shape({}).isRequired,
};

export default Album;

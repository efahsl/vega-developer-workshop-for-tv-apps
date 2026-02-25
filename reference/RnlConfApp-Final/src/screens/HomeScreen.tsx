import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import type {NativeStackNavigationProp} from '@amazon-devices/react-native-screens/native-stack';
import type {RootStackParamList} from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface MovieItem {
  id: string;
  title: string;
  description: string;
  category: string;
  trending: boolean;
  images: {
    poster_16x9: string;
    thumbnail_450x253: string;
  };
  sources: Array<{
    type: string;
    url: string;
  }>;
}

interface CatalogData {
  items: MovieItem[];
}

interface ThumbnailItemProps {
  item: MovieItem;
  onPress: () => void;
  onFocus: () => void;
}

const ThumbnailItem = ({item, onPress, onFocus}: ThumbnailItemProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      style={[styles.thumbnail, focused && styles.thumbnailFocused]}
      onFocus={() => {
        setFocused(true);
        onFocus();
      }}
      onBlur={() => setFocused(false)}
      onPress={onPress}>
      <Image
        source={{uri: item.images.thumbnail_450x253}}
        style={styles.thumbnailImage}
        resizeMode="cover"
      />
    </Pressable>
  );
};

interface ContentRowProps {
  title: string;
  items: MovieItem[];
  onItemPress: (item: MovieItem) => void;
  onItemFocus: (item: MovieItem) => void;
}

const ContentRow = ({title, items, onItemPress, onItemFocus}: ContentRowProps) => {
  const renderItem = ({item}: {item: MovieItem}) => {
    return (
      <ThumbnailItem
        item={item}
        onPress={() => onItemPress(item)}
        onFocus={() => onItemFocus(item)}
      />
    );
  };

  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowTitle}>{title}</Text>
      <FlatList
        data={items}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id}`}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/efahsl/scrap-tv-feed/refs/heads/main/catalog-fullUrls-720p.json',
      );
      const data: CatalogData = await response.json();
      setMovies(data.items);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: MovieItem) => {
    navigation.navigate('Detail', {
      bannerImage: item.images.poster_16x9,
      title: item.title,
      description: item.description,
      videoUrl: item.sources[0]?.url || '',
    });
  };

  const handleItemFocus = (item: MovieItem) => {
    // setBackgroundImage(item.images.poster_16x9);
    setBackgroundImage(item.images.thumbnail_450x253);    
  };

  // Group movies by category
  const groupMoviesByCategory = () => {
    const categoryMap: {[key: string]: MovieItem[]} = {};

    movies.forEach((movie) => {
      if (!categoryMap[movie.category]) {
        categoryMap[movie.category] = [];
      }
      categoryMap[movie.category].push(movie);
    });

    return categoryMap;
  };

  // Get trending movies
  const getTrendingMovies = () => {
    return movies.filter((movie) => movie.trending === true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const trendingMovies = getTrendingMovies();
  const moviesByCategory = groupMoviesByCategory();
  const categories = Object.keys(moviesByCategory);

  return (
    <View style={styles.container}>
      {/* Background Image */}
      {backgroundImage ? (
        <Image
          source={{uri: backgroundImage}}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      ) : null}

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trending Now Row */}
        {trendingMovies.length > 0 && (
          <ContentRow
            title="Trending Now"
            items={trendingMovies}
            onItemPress={handleItemPress}
            onItemFocus={handleItemFocus}
          />
        )}

        {/* Category Rows */}
        {categories.map((category) => (
          <ContentRow
            key={category}
            title={category}
            items={moviesByCategory[category]}
            onItemPress={handleItemPress}
            onItemFocus={handleItemFocus}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  rowContainer: {
    marginBottom: 40,
  },
  rowTitle: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
    paddingLeft: 60,
  },
  thumbnail: {
    width: 415,
    height: 235,
    margin: 15,
  },
  thumbnailFocused: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
    transform: [{scale: 1.05}],
  },
  thumbnailImage: {
    width: 400,
    height: 225, // 16:9 aspect ratio (400/16*9 = 225)
  },
});

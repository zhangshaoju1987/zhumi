import React from 'react';
import {
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Switch,
} from 'react-native';
import {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';
import DisplayLatLng from './map/DisplayLatLng';
import ViewsAsMarkers from './map/ViewsAsMarkers';
import EventListener from './map/EventListener';
import MarkerTypes from './map/MarkerTypes';
import DraggableMarkers from './map/DraggableMarkers';
import PolygonCreator from './map/PolygonCreator';
import PolylineCreator from './map/PolylineCreator';
import GradientPolylines from './map/GradientPolylines';
import AnimatedViews from './map/AnimatedViews';
import AnimatedMarkers from './map/AnimatedMarkers';
import Callouts from './map/Callouts';
import Overlays from './map/Overlays';
import DefaultMarkers from './map/DefaultMarkers';
import CustomMarkers from './map/CustomMarkers';
import CachedMap from './map/CachedMap';
import LoadingMap from './map/LoadingMap';
import MapBoundaries from './map/MapBoundaries';
import TakeSnapshot from './map/TakeSnapshot';
import FitToSuppliedMarkers from './map/FitToSuppliedMarkers';
import FitToCoordinates from './map/FitToCoordinates';
import LiteMapView from './map/LiteMapView';
import CustomTiles from './map/CustomTiles';
import WMSTiles from './map/WMSTiles';
import ZIndexMarkers from './map/ZIndexMarkers';
import StaticMap from './map/StaticMap';
import ThemeMap from './map/ThemeMap';
import MapStyle from './map/MapStyle';
import LegalLabel from './map/LegalLabel';
import SetNativePropsOverlays from './map/SetNativePropsOverlays';
import CustomOverlay from './map/CustomOverlay';
import MapKml from './map/MapKml';
import BugMarkerWontUpdate from './map/BugMarkerWontUpdate';
import ImageOverlayWithAssets from './map/ImageOverlayWithAssets';
import ImageOverlayWithURL from './map/ImageOverlayWithURL';
import ImageOverlayWithBearing from './map/ImageOverlayWithBearing';
import AnimatedNavigation from './map/AnimatedNavigation';
import OnPoiClick from './map/OnPoiClick';
import TestIdMarkers from './map/TestIdMarkers';
import IndoorMap from './map/IndoorMap';
import CameraControl from './map/CameraControl';
import MassiveCustomMarkers from './map/MassiveCustomMarkers';
import GeojsonMap from './map/Geojson';
import CacheURLTiles from './map/CacheURLTiles';
import CacheWMSTiles from './map/CacheWMSTiles';

const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';

function makeExampleMapper(useGoogleMaps: boolean) {
  if (useGoogleMaps) {
    return (example: any) => [
      example[0],
      [example[1], example[3]].filter(Boolean).join(' '),
    ];
  }
  return (example: any) => example;
}

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      Component: null,
      useGoogleMaps: ANDROID,
    };
  }

  renderExample([Component, title]: any) {
    return (
      <TouchableOpacity
        key={title}
        style={styles.button}
        onPress={() => this.setState({Component})}>
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  }

  renderBackButton() {
    return (
      <TouchableOpacity
        style={styles.back}
        onPress={() => this.setState({Component: null})}>
        <Text style={styles.backButton}>&larr;</Text>
      </TouchableOpacity>
    );
  }

  renderGoogleSwitch() {
    return (
      <View>
        <Text>Use GoogleMaps?</Text>
        <Switch
          onValueChange={value => this.setState({useGoogleMaps: value})}
          style={styles.googleSwitch}
          value={this.state.useGoogleMaps}
        />
      </View>
    );
  }

  renderExamples(examples: any) {
    const {Component, useGoogleMaps} = this.state;

    return (
      <View style={styles.container}>
        {Component && (
          <Component
            provider={useGoogleMaps ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          />
        )}
        {Component && this.renderBackButton()}
        {!Component && (
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={styles.scrollview}
            showsVerticalScrollIndicator={false}>
            {IOS && this.renderGoogleSwitch()}
            {examples.map((example: any) => this.renderExample(example))}
          </ScrollView>
        )}
      </View>
    );
  }

  render() {
    return this.renderExamples(
      [
        // [<component>, <component description>, <Google compatible>, <Google add'l description>]
        [StaticMap, 'StaticMap', true],
        [ThemeMap, 'ThemeMap', true],
        [DisplayLatLng, 'Tracking Position', true, '(incomplete)'],
        [ViewsAsMarkers, 'Arbitrary Views as Markers', true],
        [EventListener, 'Events', true, '(incomplete)'],
        [MarkerTypes, 'Image Based Markers', true],
        [DraggableMarkers, 'Draggable Markers', true],
        [PolygonCreator, 'Polygon Creator', true],
        [PolylineCreator, 'Polyline Creator', true],
        [GradientPolylines, 'Gradient Polylines', true],
        [AnimatedViews, 'Animating with MapViews'],
        [AnimatedMarkers, 'Animated Marker Position'],
        [Callouts, 'Custom Callouts', true],
        [Overlays, 'Circles, Polygons, and Polylines', true],
        [DefaultMarkers, 'Default Markers', true],
        [CustomMarkers, 'Custom Markers', true],
        [TakeSnapshot, 'Take Snapshot', true, '(incomplete)'],
        [CachedMap, 'Cached Map'],
        [LoadingMap, 'Map with loading'],
        [MapBoundaries, 'Get visible map boundaries', true],
        [FitToSuppliedMarkers, 'Focus Map On Markers', true],
        [FitToCoordinates, 'Fit Map To Coordinates', true],
        [LiteMapView, 'Android Lite MapView'],
        [CustomTiles, 'Custom Tiles', true],
        [WMSTiles, 'WMS Tiles', true],
        [ZIndexMarkers, 'Position Markers with Z-index', true],
        [MapStyle, 'Customize the style of the map', true],
        [LegalLabel, 'Reposition the legal label', true],
        [SetNativePropsOverlays, 'Update native props', true],
        [CustomOverlay, 'Custom Overlay Component', true],
        [TestIdMarkers, 'Test ID for Automation', true],
        [MapKml, 'Load Map with KML', true],
        [BugMarkerWontUpdate, "BUG: Marker Won't Update (Android)", true],
        [ImageOverlayWithAssets, 'Image Overlay Component with Assets', true],
        [ImageOverlayWithURL, 'Image Overlay Component with URL', true],
        [ImageOverlayWithBearing, 'Image Overlay with Bearing', true],
        [AnimatedNavigation, 'Animated Map Navigation', true],
        [OnPoiClick, 'On Poi Click', true],
        [IndoorMap, 'Indoor Map', true],
        [CameraControl, 'CameraControl', true],
        [MassiveCustomMarkers, 'MassiveCustomMarkers', true],
        [GeojsonMap, 'Geojson', true],
        [CacheURLTiles, 'CacheURLTiles', true],
        [CacheWMSTiles, 'CacheWMSTiles', true],
      ]
        // Filter out examples that are not yet supported for Google Maps on iOS.
        .filter(
          example =>
            ANDROID || (IOS && (example[2] || !this.state.useGoogleMaps)),
        )
        .map(makeExampleMapper(IOS && this.state.useGoogleMaps)),
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollview: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  button: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'rgba(220,220,220,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 12,
    borderRadius: 20,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {fontWeight: 'bold', fontSize: 30},
  googleSwitch: {marginBottom: 10},
});
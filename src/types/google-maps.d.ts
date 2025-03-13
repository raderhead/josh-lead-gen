
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
    }
    
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      [key: string]: any;
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
    }
    
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
        addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
        getPlace(): PlaceResult;
      }
      
      interface AutocompleteOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        types?: string[];
        fields?: string[];
        strictBounds?: boolean;
      }
      
      interface ComponentRestrictions {
        country: string | string[];
      }
      
      interface PlaceResult {
        address_components?: AddressComponent[];
        formatted_address?: string;
        geometry?: {
          location?: LatLng;
          viewport?: LatLngBounds;
        };
        place_id?: string;
        name?: string;
        types?: string[];
      }
      
      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
    }
    
    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }
    
    interface MapsEventListener {
      remove(): void;
    }
    
    namespace event {
      function clearInstanceListeners(instance: any): void;
    }
  }
}

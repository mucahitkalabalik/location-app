'use client'
import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // Redux hook'larını import ettik
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';
import { addLocation, setLocations } from '../../store/locationsSlice';  // Redux aksiyonlarını import ettik

const MapComponent = dynamic(() => import("../../components/MapComponent"), { ssr: false });

export default function Add() {
  const dispatch = useDispatch();
  const locations = useSelector(state => state.locations);  
  const [clickedPosition, setClickedPosition] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [markerColor, setMarkerColor] = useState('#ff0000');

  useEffect(() => {
    // Sayfa ilk yüklendiğinde localStorage'dan veriyi alıp Redux store'a set etme
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    dispatch(setLocations(savedLocations));  // Redux store'a kaydet
  }, [dispatch]);

  const handleSave = () => {
    if (!clickedPosition || !locationName) {
      alert('Lütfen konum seçin ve bir isim girin!');
      return;
    }

    const newLocation = {
      name: locationName,
      position: clickedPosition,
      color: markerColor,
    };

    // Yeni konumu Redux store'a ekle
    dispatch(addLocation(newLocation));

    // Redux store'dan güncellenmiş locations'ı localStorage'a kaydet
    const updatedLocations = [...locations, newLocation];
    localStorage.setItem('locations', JSON.stringify(updatedLocations));

    setClickedPosition(null);
    setLocationName('');
    setMarkerColor('#ff0000');
  };

  return (
    <Box maxW="600px" mx="auto" py={10} px={4}>
      <Heading mb={6} size="lg">Konum Ekleme Sayfası</Heading>

      <Box mb={6}>
        <MapComponent onClickMap={setClickedPosition} markerColor={markerColor} />
      </Box>

      {clickedPosition && (
        <Box mb={4}>
          <Text fontWeight="bold">Seçilen Koordinat:</Text>
          <Text>Enlem: {clickedPosition.lat}</Text>
          <Text>Boylam: {clickedPosition.lng}</Text>
        </Box>
      )}

      <VStack spacing={4} align="stretch">
        <Box>
          <Input
            placeholder="Örn: Ev, İş, Park"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </Box>

        <Box>
          <Input
            type="color"
            value={markerColor}
            onChange={(e) => setMarkerColor(e.target.value)}
            w="100px"
            h="50px"
            p={0}
            border="none"
            cursor="pointer"
          />
        </Box>

        <Button colorScheme="teal" onClick={handleSave}>
          Konumu Kaydet
        </Button>
      </VStack>
    </Box>
  );
}
